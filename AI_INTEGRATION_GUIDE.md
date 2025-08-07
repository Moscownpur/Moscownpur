# 🤖 AI Integration Guide - MosCownpur

## Overview

The AI Integration system in MosCownpur provides advanced AI-powered storytelling capabilities with memory management, character simulation, and context-aware responses. This system leverages Google Gemini AI to create intelligent, memory-backed interactions.

## 🧠 Core Components

### 1. Memory Engine (`aiMemoryEngine.ts`)

The central AI service that manages:
- **Entity Summaries**: Contextual memories for characters, worlds, and scenes
- **Memory Versioning**: Track changes and rollback capabilities
- **Relevance Scoring**: Automatic scoring based on usage and context
- **Smart Tagging**: Emotion, plot, lore, and relationship tags

### 2. Database Schema

#### `entity_summaries` Table
```sql
- id (uuid, primary key)
- entity_type (character, region, world, timeline_event, scene)
- entity_id (uuid, foreign key)
- summary_text (text, not null)
- memory_type (hard, soft, ephemeral)
- version (integer)
- is_current (boolean)
- tags (text array)
- last_used_in_scene (uuid, nullable)
- editable (boolean)
- used_recently (boolean)
- relevance_score (float)
- created_by (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### `memory_tags` Table
```sql
- id (uuid, primary key)
- name (text, unique)
- category (emotion, plot, lore, relationship, location, temporal)
- color (text)
- description (text)
- created_by (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### `ai_chat_logs` Table
```sql
- id (uuid, primary key)
- character_id (uuid, foreign key)
- world_id (uuid, foreign key)
- user_message (text)
- ai_response (text)
- context_memories_used (text array)
- scene_context (text)
- emotion_detected (text)
- memory_impact (text)
- created_by (text)
- created_at (timestamptz)
```

#### `context_templates` Table
```sql
- id (uuid, primary key)
- name (text, unique)
- template_type (scene_continuation, character_chat, plot_development, etc.)
- prompt_template (text)
- variables (text array)
- description (text)
- is_active (boolean)
- created_by (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

## 🚀 Features

### 1. Memory Management

#### Creating Memories
```typescript
import { aiMemoryEngine } from '../lib/aiMemoryEngine';

// Create a character memory
const memory = await aiMemoryEngine.createEntitySummary(
  'character',
  characterId,
  'Zareth is a brave knight haunted by his brother\'s betrayal',
  'hard',
  ['[emotion:anger]', '[plot:conflict]']
);
```

#### Retrieving Memories
```typescript
// Get all memories for a character
const memories = await aiMemoryEngine.getEntitySummaries('character', characterId);

// Get relevant memories based on context
const relevantMemories = await aiMemoryEngine.getRelevantMemories(
  'character',
  characterId,
  'battle scene',
  5
);
```

### 2. Character Chat Simulator

#### Basic Usage
```typescript
const response = await aiMemoryEngine.chatWithCharacter(
  characterId,
  'Tell me about your past',
  worldId,
  'In the castle courtyard'
);
```

#### Response Structure
```typescript
interface CharacterChatResponse {
  text: string;
  memories_used: string[];
  character_name: string;
  character_state: string;
  emotion_detected?: string;
}
```

### 3. Scene Continuation

#### Generate Scene Continuations
```typescript
const continuation = await aiMemoryEngine.continueScene(
  sceneId,
  'Previous dialogue text...',
  worldId
);
```

#### Response Structure
```typescript
interface SceneContinuationResponse {
  text: string;
  memories_used: string[];
  scene_suggestions: string[];
  character_actions: string[];
  plot_developments: string[];
}
```

### 4. Plot Suggestions

#### Generate Plot Ideas
```typescript
const suggestions = await aiMemoryEngine.generatePlotSuggestions(worldId);
```

## 🎯 Usage Examples

### 1. Setting Up AI Integration

#### Environment Variables
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

#### Basic Configuration
```typescript
import { AIMemoryEngine } from '../lib/aiMemoryEngine';

const aiEngine = new AIMemoryEngine({
  model: 'gemini-2.5-flash',
  temperature: 0.7,
  max_tokens: 1000,
  memory_context_length: 5,
  enable_memory_learning: true,
  auto_tag_memories: true
});
```

### 2. Character Development Workflow

#### Step 1: Create Character Memories
```typescript
// Create hard memories (core personality)
await aiMemoryEngine.createEntitySummary(
  'character',
  characterId,
  'Zareth is a loyal knight who values honor above all else',
  'hard',
  ['[lore:history]', '[relationship:loyalty]']
);

// Create soft memories (experiences)
await aiMemoryEngine.createEntitySummary(
  'character',
  characterId,
  'Zareth was betrayed by his brother during the war',
  'soft',
  ['[emotion:anger]', '[plot:conflict]', '[temporal:past]']
);
```

#### Step 2: Chat with Character
```typescript
const response = await aiMemoryEngine.chatWithCharacter(
  characterId,
  'How do you feel about your brother?',
  worldId
);

console.log(response.text);
// Output: "My brother... *clenches fists* He was once my closest ally, 
// but his betrayal during the war changed everything. I cannot forgive 
// what he did, though part of me still remembers the bond we once shared."
```

#### Step 3: Memory Learning
The system automatically:
- Analyzes interactions for new insights
- Creates new memories based on responses
- Updates existing memories with new context
- Finds connections between memories

### 3. Scene Writing Workflow

#### Step 1: Build Scene Context
```typescript
const context = await aiMemoryEngine.buildContext(worldId, characterId, sceneId);
```

#### Step 2: Continue Scene
```typescript
const continuation = await aiMemoryEngine.continueScene(
  sceneId,
  'Zareth: "I will not let you destroy everything we built!"',
  worldId
);
```

#### Step 3: Generate Plot Ideas
```typescript
const plotIdeas = await aiMemoryEngine.generatePlotSuggestions(worldId);
```

## 🎨 UI Components

### 1. MemoryManager Component

```typescript
<MemoryManager
  entityType="character"
  entityId={characterId}
  onMemoryUpdate={(memories) => {
    console.log('Memories updated:', memories);
  }}
/>
```

**Features:**
- Create, edit, and delete memories
- Filter by memory type, relevance, and usage
- Tag management with visual indicators
- Version control and rollback

### 2. CharacterChatSimulator Component

```typescript
<CharacterChatSimulator
  worldId={worldId}
  characterId={characterId}
  sceneContext="In the castle courtyard"
/>
```

**Features:**
- Real-time chat interface
- Emotion detection and display
- Memory panel showing active memories
- Character selection and context

### 3. AIIntegration Page

```typescript
// Route: /dashboard/ai-integration/:worldId
<AIIntegration />
```

**Features:**
- Comprehensive AI hub
- Tabbed interface (Chat, Memory, Analytics)
- Entity selection (World, Character, Scene)
- Plot suggestion generation

## 🔧 Configuration

### AI Model Settings

```typescript
const DEFAULT_AI_CONFIG: AIIntegrationConfig = {
  model: 'gemini-2.5-flash',
  temperature: 0.7,           // Creativity level (0.0 - 1.0)
  max_tokens: 1000,           // Maximum response length
  memory_context_length: 5,   // Number of memories to include
  enable_memory_learning: true, // Auto-learn from interactions
  auto_tag_memories: true     // Auto-tag new memories
};
```

### Memory Types

- **Hard Memories**: Core personality traits, fundamental facts
- **Soft Memories**: Experiences, emotions, relationships
- **Ephemeral Memories**: Temporary context, current situations

### Tag Categories

- **Emotion**: joy, sadness, anger, fear, surprise
- **Plot**: conflict, resolution, twist
- **Lore**: history, magic, technology
- **Relationship**: romance, friendship, rivalry
- **Location**: home, dangerous, sacred
- **Temporal**: past, present, future

## 📊 Analytics and Monitoring

### Memory Analytics View
```sql
SELECT 
  entity_type,
  entity_id,
  COUNT(*) as total_memories,
  COUNT(*) FILTER (WHERE is_current = true) as current_memories,
  AVG(relevance_score) as avg_relevance,
  MAX(updated_at) as last_updated
FROM entity_summaries
GROUP BY entity_type, entity_id;
```

### Chat Log Analysis
```sql
SELECT 
  character_id,
  COUNT(*) as total_interactions,
  AVG(LENGTH(ai_response)) as avg_response_length,
  MODE() WITHIN GROUP (ORDER BY emotion_detected) as most_common_emotion
FROM ai_chat_logs
GROUP BY character_id;
```

## 🚀 Best Practices

### 1. Memory Creation

- **Start with Hard Memories**: Define core personality traits first
- **Use Descriptive Tags**: Tag memories with relevant categories
- **Version Control**: Create new versions for significant changes
- **Context Matters**: Include relevant context in memory summaries

### 2. Character Development

- **Progressive Memory Building**: Start simple, add complexity over time
- **Consistent Personality**: Ensure memories align with character traits
- **Emotional Depth**: Include emotional context in memories
- **Relationship Mapping**: Create memories that reference other characters

### 3. Scene Writing

- **Context Building**: Always provide scene context for better responses
- **Memory Integration**: Reference relevant memories in scene descriptions
- **Character Consistency**: Ensure character responses align with their memories
- **Plot Continuity**: Use plot suggestions to maintain story coherence

### 4. Performance Optimization

- **Lazy Loading**: Load memories only when needed
- **Caching**: Cache frequently accessed memories
- **Batch Operations**: Group memory operations when possible
- **Relevance Filtering**: Use relevance scores to limit memory context

## 🔍 Troubleshooting

### Common Issues

1. **API Key Not Found**
   - Ensure `VITE_GEMINI_API_KEY` is set in environment variables
   - Check API key format (should start with "AI")

2. **Memory Not Loading**
   - Verify entity exists in database
   - Check RLS policies for user access
   - Ensure proper entity type and ID

3. **Character Responses Inconsistent**
   - Review character memories for conflicts
   - Check memory relevance scores
   - Verify character personality consistency

4. **Slow Response Times**
   - Reduce memory context length
   - Optimize memory queries
   - Use relevance filtering

### Debug Mode

Enable debug logging:
```typescript
const aiEngine = new AIMemoryEngine({
  ...config,
  debug: true
});
```

## 🔮 Future Enhancements

### Planned Features

1. **Memory Visualization**
   - Interactive memory graph
   - Connection mapping
   - Visual memory timeline

2. **Advanced Learning**
   - Sentiment analysis
   - Character arc tracking
   - Automatic plot suggestions

3. **Multi-Modal AI**
   - Image generation for scenes
   - Voice synthesis for characters
   - Video scene creation

4. **Collaborative Features**
   - Shared memory spaces
   - Team storytelling
   - Memory conflict resolution

## 📚 API Reference

### AIMemoryEngine Class

#### Methods

- `createEntitySummary(entityType, entityId, summaryText, memoryType, tags)`
- `updateEntitySummary(summaryId, updates)`
- `getEntitySummaries(entityType, entityId, filter)`
- `getRelevantMemories(entityType, entityId, context, limit)`
- `buildContext(worldId, characterId?, sceneId?)`
- `generatePrompt(templateType, variables)`
- `chatWithCharacter(characterId, userMessage, worldId, sceneContext?)`
- `continueScene(sceneId, previousDialogue, worldId)`
- `generatePlotSuggestions(worldId)`
- `learnFromInteraction(characterId, userMessage, aiResponse, context)`

### Types

- `EntitySummary`
- `MemoryTag`
- `AIChatLog`
- `ContextTemplate`
- `CharacterChatResponse`
- `SceneContinuationResponse`
- `AIResponse`
- `MemoryFilter`
- `MemoryUpdate`
- `AIIntegrationConfig`

---

This AI integration system transforms MosCownpur from a simple worldbuilding tool into an intelligent storytelling platform where characters have memories, emotions, and consistent personalities that evolve through interactions. 