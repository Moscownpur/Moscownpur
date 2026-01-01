import { supabase } from './supabase';
import { generateText } from './ai';
import {
  EntitySummary,
  MemoryTag,
  ContextTemplate,
  ContextBuilder,
  PromptVariables,
  AIResponse,
  CharacterChatResponse,
  SceneContinuationResponse,
  MemoryFilter,
  MemoryUpdate,
  AIIntegrationConfig,
  MemoryLearningResult
} from '../types/ai';

// Memory cache with TTL
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttl: number = 300000): void { // 5 minutes default TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

// Default AI configuration
const DEFAULT_AI_CONFIG: AIIntegrationConfig = {
  model: 'gemini-2.5-flash',
  temperature: 0.7,
  max_tokens: 1000,
  memory_context_length: 5,
  enable_memory_learning: true,
  auto_tag_memories: true
};

export class AIMemoryEngine {
  private config: AIIntegrationConfig;
  private cache = new MemoryCache();

  constructor(config: Partial<AIIntegrationConfig> = {}) {
    this.config = { ...DEFAULT_AI_CONFIG, ...config };
  }

  // Memory Management Methods
  async createEntitySummary(
    entityType: EntitySummary['entity_type'],
    entityId: string,
    summaryText: string,
    memoryType: EntitySummary['memory_type'] = 'hard',
    tags: string[] = []
  ): Promise<EntitySummary> {
    // Deactivate current summary if it exists
    await this.deactivateCurrentSummary(entityType, entityId);

    const { data, error } = await supabase
      .from('entity_summaries')
      .insert({
        entity_type: entityType,
        entity_id: entityId,
        summary_text: summaryText,
        memory_type: memoryType,
        tags,
        version: 1,
        is_current: true
      })
      .select()
      .single();

    if (error) throw error;
    
    // Invalidate cache for this entity
    this.cache.invalidate(`${entityType}:${entityId}`);
    return data;
  }

  async batchCreateEntitySummaries(
    summaries: Array<{
      entityType: EntitySummary['entity_type'];
      entityId: string;
      summaryText: string;
      memoryType?: EntitySummary['memory_type'];
      tags?: string[];
    }>
  ): Promise<EntitySummary[]> {
    // Group by entity type and ID for batch deactivation
    const entityGroups = summaries.reduce((groups, summary) => {
      const key = `${summary.entityType}:${summary.entityId}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(summary);
      return groups;
    }, {} as Record<string, typeof summaries>);

    // Batch deactivate current summaries
    const deactivationPromises = Object.keys(entityGroups).map(async (key) => {
      const [entityType, entityId] = key.split(':');
      await this.deactivateCurrentSummary(entityType, entityId);
    });
    await Promise.all(deactivationPromises);

    // Batch insert new summaries
    const insertData = summaries.map(summary => ({
      entity_type: summary.entityType,
      entity_id: summary.entityId,
      summary_text: summary.summaryText,
      memory_type: summary.memoryType || 'hard',
      tags: summary.tags || [],
      version: 1,
      is_current: true
    }));

    const { data, error } = await supabase
      .from('entity_summaries')
      .insert(insertData)
      .select();

    if (error) throw error;
    
    // Invalidate cache for all affected entities
    Object.keys(entityGroups).forEach(key => {
      this.cache.invalidate(key);
    });
    
    return data || [];
  }

  async updateEntitySummary(
    summaryId: string,
    updates: MemoryUpdate
  ): Promise<EntitySummary> {
    const { data, error } = await supabase
      .from('entity_summaries')
      .update(updates)
      .eq('id', summaryId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getEntitySummaries(
    entityType: string,
    entityId: string,
    filter: MemoryFilter = {}
  ): Promise<EntitySummary[]> {
    // Check cache first
    const cacheKey = `${entityType}:${entityId}:${JSON.stringify(filter)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    let query = supabase
      .from('entity_summaries')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId);

    if (filter.memory_type) {
      query = query.eq('memory_type', filter.memory_type);
    }
    if (filter.tags && filter.tags.length > 0) {
      query = query.overlaps('tags', filter.tags);
    }
    if (filter.min_relevance) {
      query = query.gte('relevance_score', filter.min_relevance);
    }
    if (filter.used_recently !== undefined) {
      query = query.eq('used_recently', filter.used_recently);
    }

    const { data, error } = await query.order('relevance_score', { ascending: false });
    if (error) throw error;
    
    const result = data || [];
    this.cache.set(cacheKey, result, 300000); // 5 minutes cache
    return result;
  }

  async getRelevantMemories(
    entityType: string,
    entityId: string,
    context: string,
    limit: number = 5
  ): Promise<EntitySummary[]> {
    // Get memories and calculate relevance based on context
    const memories = await this.getEntitySummaries(entityType, entityId);
    
    // Simple relevance scoring based on tag overlap and recency
    const scoredMemories = memories.map(memory => ({
      ...memory,
      context_relevance: this.calculateContextRelevance(memory, context)
    }));

    return scoredMemories
      .sort((a, b) => b.context_relevance - a.context_relevance)
      .slice(0, limit);
  }

  // Context Building Methods
  async buildContext(
    worldId: string,
    characterId?: string,
    sceneId?: string
  ): Promise<ContextBuilder> {
    const world = await this.getWorldContext(worldId);
    const character = characterId ? await this.getCharacterContext(characterId) : '';
    const scene = sceneId ? await this.getSceneContext(sceneId) : '';
    
    const activeMemories = await this.getActiveMemories(worldId, characterId);
    const memoryContext = this.formatMemoryContext(activeMemories);
    const relevantTags = await this.getRelevantTags(activeMemories);

    return {
      world_context: world,
      character_context: character,
      scene_context: scene,
      memory_context: memoryContext,
      active_memories: activeMemories,
      relevant_tags: relevantTags
    };
  }

  async generatePrompt(
    templateType: ContextTemplate['template_type'],
    variables: PromptVariables
  ): Promise<string> {
    const { data: template, error } = await supabase
      .from('context_templates')
      .select('*')
      .eq('template_type', templateType)
      .eq('is_active', true)
      .single();

    if (error || !template) {
      throw new Error(`Template not found for type: ${templateType}`);
    }

    let prompt = template.prompt_template;
    
    // Replace variables in template
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      prompt = prompt.replace(new RegExp(placeholder, 'g'), value || '');
    });

    return prompt;
  }

  // AI Integration Methods
  async chatWithCharacter(
    characterId: string,
    userMessage: string,
    worldId: string,
    sceneContext?: string
  ): Promise<CharacterChatResponse> {
    const character = await this.getCharacterById(characterId);
    const context = await this.buildContext(worldId, characterId);
    
    const prompt = await this.generatePrompt('character_chat', {
      character_name: character.name,
      character_background: this.formatCharacterBackground(character),
      current_situation: sceneContext || 'General conversation',
      user_message: userMessage,
      active_memories: this.formatMemoryContext(context.active_memories)
    });

    const aiResponse = await generateText(prompt, this.config.model);
    
    // Log the chat interaction
    await this.logChatInteraction(characterId, worldId, userMessage, aiResponse, context);

    // Learn from the interaction
    if (this.config.enable_memory_learning) {
      await this.learnFromInteraction(characterId, userMessage, aiResponse, context);
    }

    return {
      text: aiResponse,
      memories_used: context.active_memories.map(m => m.id),
      character_name: character.name,
      character_state: 'engaged',
      emotion_detected: this.detectEmotion(aiResponse)
    };
  }

  async continueScene(
    sceneId: string,
    previousDialogue: string,
    worldId: string
  ): Promise<SceneContinuationResponse> {
    const scene = await this.getSceneById(sceneId);
    const context = await this.buildContext(worldId, undefined, sceneId);
    
    const prompt = await this.generatePrompt('scene_continuation', {
      world_context: context.world_context,
      character_context: context.character_context,
      scene_context: context.scene_context,
      previous_dialogue: previousDialogue,
      memory_context: context.memory_context
    });

    const aiResponse = await generateText(prompt, this.config.model);

    return {
      text: aiResponse,
      memories_used: context.active_memories.map(m => m.id),
      scene_suggestions: this.extractSceneSuggestions(aiResponse),
      character_actions: this.extractCharacterActions(aiResponse),
      plot_developments: this.extractPlotDevelopments(aiResponse)
    };
  }

  async generatePlotSuggestions(worldId: string): Promise<AIResponse> {
    const context = await this.buildContext(worldId);
    
    const prompt = await this.generatePrompt('plot_development', {
      world_state: context.world_context,
      character_arcs: context.character_context,
      recent_events: context.scene_context,
      story_themes: this.extractStoryThemes(context),
      memory_context: context.memory_context
    });

    const aiResponse = await generateText(prompt, this.config.model);

    return {
      text: aiResponse,
      memories_used: context.active_memories.map(m => m.id),
      suggested_actions: this.extractSuggestedActions(aiResponse)
    };
  }

  // Memory Learning Methods
  async learnFromInteraction(
    characterId: string,
    userMessage: string,
    aiResponse: string,
    context: ContextBuilder
  ): Promise<MemoryLearningResult> {
    const newMemories: EntitySummary[] = [];
    const updatedMemories: EntitySummary[] = [];

    // Analyze the interaction for new insights
    const insights = await this.analyzeInteraction(userMessage, aiResponse, context);
    
    // Create new memories based on insights
    for (const insight of insights) {
      const newMemory = await this.createEntitySummary(
        'character',
        characterId,
        insight.summary,
        'soft',
        insight.tags
      );
      newMemories.push(newMemory);
    }

    // Update existing memories with new context
    for (const memory of context.active_memories) {
      if (this.shouldUpdateMemory(memory, userMessage, aiResponse)) {
        const updatedMemory = await this.updateEntitySummary(memory.id, {
          used_recently: true,
          summary_text: this.enhanceMemoryText(memory.summary_text, aiResponse)
        });
        updatedMemories.push(updatedMemory);
      }
    }

    return {
      new_memories: newMemories,
      updated_memories: updatedMemories,
      memory_connections: this.findMemoryConnections(newMemories, context.active_memories)
    };
  }

  // Utility Methods
  private async deactivateCurrentSummary(entityType: string, entityId: string): Promise<void> {
    await supabase
      .from('entity_summaries')
      .update({ is_current: false })
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .eq('is_current', true);
  }

  private calculateContextRelevance(memory: EntitySummary, context: string): number {
    let relevance = memory.relevance_score;
    
    // Boost relevance if tags match context keywords
    const contextKeywords = context.toLowerCase().split(' ');
    const tagMatches = memory.tags.filter(tag => 
      contextKeywords.some(keyword => tag.toLowerCase().includes(keyword))
    );
    
    relevance += tagMatches.length * 0.2;
    
    return Math.min(relevance, 1.0);
  }

  private async getWorldContext(worldId: string): Promise<string> {
    const { data: world } = await supabase
      .from('worlds')
      .select('name, description, type, theme')
      .eq('id', worldId)
      .single();
    
    return world ? `${world.name} (${world.type}): ${world.description}. Theme: ${world.theme}` : '';
  }

  private async getCharacterContext(characterId: string): Promise<string> {
    const { data: character } = await supabase
      .from('characters')
      .select('name, species, personality, skills_and_abilities, arc_summary')
      .eq('id', characterId)
      .single();
    
    return character ? `${character.name} (${character.species}): ${character.arc_summary}` : '';
  }

  private async getSceneContext(sceneId: string): Promise<string> {
    const { data: scene } = await supabase
      .from('scenes')
      .select('title, description, dialogue')
      .eq('id', sceneId)
      .single();
    
    return scene ? `${scene.title}: ${scene.description}` : '';
  }

  private async getActiveMemories(worldId: string, characterId?: string): Promise<EntitySummary[]> {
    const memories: EntitySummary[] = [];
    
    // Get world memories
    const worldMemories = await this.getEntitySummaries('world', worldId, { used_recently: true });
    memories.push(...worldMemories);
    
    // Get character memories if specified
    if (characterId) {
      const characterMemories = await this.getEntitySummaries('character', characterId, { used_recently: true });
      memories.push(...characterMemories);
    }
    
    return memories.sort((a, b) => b.relevance_score - a.relevance_score);
  }

  private formatMemoryContext(memories: EntitySummary[]): string {
    return memories
      .map(memory => `[${memory.memory_type.toUpperCase()}] ${memory.summary_text}`)
      .join('\n');
  }

  private async getRelevantTags(memories: EntitySummary[]): Promise<MemoryTag[]> {
    const allTags = memories.flatMap(m => m.tags);
    const uniqueTags = [...new Set(allTags)];
    
    if (uniqueTags.length === 0) return [];
    
    const { data } = await supabase
      .from('memory_tags')
      .select('*')
      .in('name', uniqueTags);
    
    return data || [];
  }

  private async getCharacterById(characterId: string) {
    const { data } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .single();
    
    if (!data) throw new Error(`Character not found: ${characterId}`);
    return data;
  }

  private async getSceneById(sceneId: string) {
    const { data } = await supabase
      .from('scenes')
      .select('*')
      .eq('id', sceneId)
      .single();
    
    if (!data) throw new Error(`Scene not found: ${sceneId}`);
    return data;
  }

  private formatCharacterBackground(character: any): string {
    return `${character.name} is a ${character.species} from ${character.origin}. ${character.arc_summary}`;
  }

  private async logChatInteraction(
    characterId: string,
    worldId: string,
    userMessage: string,
    aiResponse: string,
    context: ContextBuilder
  ): Promise<void> {
    await supabase.from('ai_chat_logs').insert({
      character_id: characterId,
      world_id: worldId,
      user_message: userMessage,
      ai_response: aiResponse,
      context_memories_used: context.active_memories.map(m => m.id),
      scene_context: context.scene_context,
      emotion_detected: this.detectEmotion(aiResponse),
      memory_impact: 'interaction_logged'
    });
  }

  private detectEmotion(text: string): string {
    const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust'];
    const lowerText = text.toLowerCase();
    
    for (const emotion of emotions) {
      if (lowerText.includes(emotion)) return emotion;
    }
    
    return 'neutral';
  }

  private extractSceneSuggestions(text: string): string[] {
    // Simple extraction - in production, use more sophisticated parsing
    return text.split('\n').filter(line => 
      line.toLowerCase().includes('scene') || line.toLowerCase().includes('suggest')
    );
  }

  private extractCharacterActions(text: string): string[] {
    return text.split('\n').filter(line => 
      line.toLowerCase().includes('action') || line.toLowerCase().includes('do')
    );
  }

  private extractPlotDevelopments(text: string): string[] {
    return text.split('\n').filter(line => 
      line.toLowerCase().includes('plot') || line.toLowerCase().includes('develop')
    );
  }

  private extractSuggestedActions(text: string): string[] {
    return text.split('\n').filter(line => 
      line.toLowerCase().includes('suggest') || line.toLowerCase().includes('could')
    );
  }

  private extractStoryThemes(context: ContextBuilder): string {
    // Extract themes from world and character context
    const themes = [];
    if (context.world_context.includes('conflict')) themes.push('conflict');
    if (context.world_context.includes('love')) themes.push('love');
    if (context.world_context.includes('power')) themes.push('power');
    return themes.join(', ');
  }

  private async analyzeInteraction(
    userMessage: string,
    aiResponse: string,
    context: ContextBuilder
  ): Promise<Array<{ summary: string; tags: string[] }>> {
    // Simple analysis - in production, use AI to analyze interactions
    const insights = [];
    
    if (aiResponse.includes('remember')) {
      insights.push({
        summary: `Character recalls past events: ${aiResponse}`,
        tags: ['[temporal:past]', '[lore:history]']
      });
    }
    
    if (aiResponse.includes('feel') || aiResponse.includes('emotion')) {
      insights.push({
        summary: `Character expresses emotion: ${aiResponse}`,
        tags: ['[emotion:joy]']
      });
    }
    
    return insights;
  }

  private shouldUpdateMemory(memory: EntitySummary, userMessage: string, aiResponse: string): boolean {
    // Simple logic - in production, use more sophisticated analysis
    return memory.memory_type === 'soft' && 
           (userMessage.includes('remember') || aiResponse.includes('memory'));
  }

  private enhanceMemoryText(currentText: string, newContext: string): string {
    // Simple enhancement - in production, use AI to merge contexts
    return `${currentText} [Enhanced with: ${newContext.substring(0, 100)}...]`;
  }

  private findMemoryConnections(
    newMemories: EntitySummary[],
    existingMemories: EntitySummary[]
  ): Array<{ source_memory: string; target_memory: string; connection_strength: number; connection_type: string }> {
    const connections = [];
    
    for (const newMemory of newMemories) {
      for (const existingMemory of existingMemories) {
        const strength = this.calculateConnectionStrength(newMemory, existingMemory);
        if (strength > 0.3) {
          connections.push({
            source_memory: newMemory.id,
            target_memory: existingMemory.id,
            connection_strength: strength,
            connection_type: 'semantic'
          });
        }
      }
    }
    
    return connections;
  }

  private calculateConnectionStrength(memory1: EntitySummary, memory2: EntitySummary): number {
    // Simple similarity calculation - in production, use embeddings
    const tags1 = memory1.tags.join(' ').toLowerCase();
    const tags2 = memory2.tags.join(' ').toLowerCase();
    
    const commonWords = tags1.split(' ').filter(word => tags2.includes(word));
    return commonWords.length / Math.max(tags1.split(' ').length, tags2.split(' ').length);
  }
}

// Export singleton instance
export const aiMemoryEngine = new AIMemoryEngine(); 