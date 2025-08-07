import React, { useState, useEffect } from 'react';
import { EntitySummary, MemoryTag, MemoryFilter } from '../../types/ai';
import { aiMemoryEngine } from '../../lib/aiMemoryEngine';
import toast from 'react-hot-toast';

interface MemoryManagerProps {
  entityType: EntitySummary['entity_type'];
  entityId: string;
  onMemoryUpdate?: (memories: EntitySummary[]) => void;
}

const MemoryManager: React.FC<MemoryManagerProps> = ({
  entityType,
  entityId,
  onMemoryUpdate
}) => {
  const [memories, setMemories] = useState<EntitySummary[]>([]);
  const [tags, setTags] = useState<MemoryTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<MemoryFilter>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMemory, setNewMemory] = useState({
    summary_text: '',
    memory_type: 'hard' as EntitySummary['memory_type'],
    tags: [] as string[]
  });

  useEffect(() => {
    loadMemories();
    loadTags();
  }, [entityType, entityId, filter]);

  const loadMemories = async () => {
    try {
      setLoading(true);
      const memoriesData = await aiMemoryEngine.getEntitySummaries(entityType, entityId, filter);
      setMemories(memoriesData);
      onMemoryUpdate?.(memoriesData);
    } catch (error) {
      toast.error('Failed to load memories');
      console.error('Error loading memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const { data } = await supabase.from('memory_tags').select('*');
      setTags(data || []);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleCreateMemory = async () => {
    try {
      await aiMemoryEngine.createEntitySummary(
        entityType,
        entityId,
        newMemory.summary_text,
        newMemory.memory_type,
        newMemory.tags
      );
      
      toast.success('Memory created successfully');
      setNewMemory({ summary_text: '', memory_type: 'hard', tags: [] });
      setShowCreateForm(false);
      loadMemories();
    } catch (error) {
      toast.error('Failed to create memory');
      console.error('Error creating memory:', error);
    }
  };

  const handleUpdateMemory = async (memoryId: string, updates: Partial<EntitySummary>) => {
    try {
      await aiMemoryEngine.updateEntitySummary(memoryId, updates);
      toast.success('Memory updated successfully');
      loadMemories();
    } catch (error) {
      toast.error('Failed to update memory');
      console.error('Error updating memory:', error);
    }
  };

  const handleToggleTag = (tagName: string) => {
    setNewMemory(prev => ({
      ...prev,
      tags: prev.tags.includes(tagName)
        ? prev.tags.filter(t => t !== tagName)
        : [...prev.tags, tagName]
    }));
  };

  const getMemoryTypeColor = (type: EntitySummary['memory_type']) => {
    switch (type) {
      case 'hard': return 'bg-blue-500';
      case 'soft': return 'bg-green-500';
      case 'ephemeral': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    if (score >= 0.4) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-600 rounded"></div>
            <div className="h-20 bg-gray-600 rounded"></div>
            <div className="h-20 bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold gradient-text-cosmic">
          🧠 Memory Manager
        </h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary bg-gradient-to-r from-purple-500 to-pink-500"
        >
          {showCreateForm ? 'Cancel' : '+ Add Memory'}
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filter.memory_type || ''}
            onChange={(e) => setFilter(prev => ({ ...prev, memory_type: e.target.value as any }))}
            className="input-field"
          >
            <option value="">All Memory Types</option>
            <option value="hard">Hard Memories</option>
            <option value="soft">Soft Memories</option>
            <option value="ephemeral">Ephemeral Memories</option>
          </select>

          <select
            value={filter.used_recently === undefined ? '' : filter.used_recently.toString()}
            onChange={(e) => setFilter(prev => ({ 
              ...prev, 
              used_recently: e.target.value === '' ? undefined : e.target.value === 'true'
            }))}
            className="input-field"
          >
            <option value="">All Usage</option>
            <option value="true">Recently Used</option>
            <option value="false">Not Recently Used</option>
          </select>

          <input
            type="number"
            placeholder="Min Relevance Score"
            value={filter.min_relevance || ''}
            onChange={(e) => setFilter(prev => ({ 
              ...prev, 
              min_relevance: e.target.value ? parseFloat(e.target.value) : undefined
            }))}
            className="input-field"
            min="0"
            max="1"
            step="0.1"
          />
        </div>
      </div>

      {/* Create Memory Form */}
      {showCreateForm && (
        <div className="glass-card p-6">
          <h4 className="text-lg font-semibold mb-4">Create New Memory</h4>
          
          <div className="space-y-4">
            <textarea
              value={newMemory.summary_text}
              onChange={(e) => setNewMemory(prev => ({ ...prev, summary_text: e.target.value }))}
              placeholder="Enter memory summary..."
              className="input-field h-24"
            />

            <div className="flex gap-4">
              <select
                value={newMemory.memory_type}
                onChange={(e) => setNewMemory(prev => ({ 
                  ...prev, 
                  memory_type: e.target.value as EntitySummary['memory_type']
                }))}
                className="input-field"
              >
                <option value="hard">Hard Memory</option>
                <option value="soft">Soft Memory</option>
                <option value="ephemeral">Ephemeral Memory</option>
              </select>
            </div>

            {/* Tag Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleToggleTag(tag.name)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      newMemory.tags.includes(tag.name)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                    style={{ borderColor: tag.color }}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreateMemory}
                disabled={!newMemory.summary_text.trim()}
                className="btn-primary bg-gradient-to-r from-green-500 to-teal-500 disabled:opacity-50"
              >
                Create Memory
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Memory List */}
      <div className="space-y-4">
        {memories.length === 0 ? (
          <div className="glass-card p-6 text-center text-gray-400">
            No memories found. Create your first memory to get started!
          </div>
        ) : (
          memories.map(memory => (
            <div key={memory.id} className="glass-card p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getMemoryTypeColor(memory.memory_type)}`}>
                    {memory.memory_type.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">v{memory.version}</span>
                  {memory.is_current && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-500">
                      CURRENT
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getRelevanceColor(memory.relevance_score)}`}>
                    {Math.round(memory.relevance_score * 100)}% relevant
                  </span>
                  {memory.used_recently && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500">
                      RECENT
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-300 mb-3">{memory.summary_text}</p>

              {/* Tags */}
              {memory.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {memory.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded text-xs font-medium bg-gray-600 text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {memory.editable && (
                  <button
                    onClick={() => handleUpdateMemory(memory.id, { used_recently: !memory.used_recently })}
                    className="btn-secondary text-xs"
                  >
                    {memory.used_recently ? 'Mark Unused' : 'Mark Recent'}
                  </button>
                )}
                <span className="text-xs text-gray-400">
                  Updated: {new Date(memory.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemoryManager; 