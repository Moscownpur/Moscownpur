import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { World, Character, Scene } from '../types';
import { aiMemoryEngine } from '../lib/aiMemoryEngine';
import MemoryManager from '../components/ai/MemoryManager';
import CharacterChatSimulator from '../components/ai/CharacterChatSimulator';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const AIIntegration: React.FC = () => {
  const { worldId } = useParams<{ worldId: string }>();
  const [world, setWorld] = useState<World | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'memory' | 'analytics'>('chat');
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'character' | 'world' | 'scene';
    id: string;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (worldId) {
      loadWorldData();
    }
  }, [worldId]);

  const loadWorldData = async () => {
    try {
      setLoading(true);
      
      // Load world
      const { data: worldData } = await supabase
        .from('worlds')
        .select('*')
        .eq('id', worldId)
        .single();
      
      if (worldData) {
        setWorld(worldData);
        setSelectedEntity({
          type: 'world',
          id: worldData.id,
          name: worldData.name
        });
      }

      // Load characters
      const { data: charactersData } = await supabase
        .from('characters')
        .select('*')
        .eq('world_id', worldId);
      
      setCharacters(charactersData || []);

      // Load scenes
      const { data: scenesData } = await supabase
        .from('scenes')
        .select('*')
        .eq('world_id', worldId);
      
      setScenes(scenesData || []);

    } catch (error) {
      toast.error('Failed to load world data');
      console.error('Error loading world data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEntitySelect = (type: 'character' | 'world' | 'scene', id: string, name: string) => {
    setSelectedEntity({ type, id, name });
  };

  const handleGeneratePlotSuggestions = async () => {
    if (!worldId) return;

    try {
      toast.loading('Generating plot suggestions...');
      const suggestions = await aiMemoryEngine.generatePlotSuggestions(worldId);
      toast.dismiss();
      toast.success('Plot suggestions generated!');
      
      // You could display these in a modal or dedicated section
      console.log('Plot suggestions:', suggestions);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate plot suggestions');
      console.error('Error generating plot suggestions:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-white/20 border-t-white/80 mx-auto mb-4"></div>
          <p className="text-white/60">Loading AI Integration...</p>
        </div>
      </div>
    );
  }

  if (!world) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60">World not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="glass-card p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold gradient-text-cosmic mb-2">
                🤖 AI Integration Hub
              </h1>
              <p className="text-gray-300 mb-4">
                Advanced AI-powered storytelling with memory management and character simulation
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>World: {world.name}</span>
                <span>Characters: {characters.length}</span>
                <span>Scenes: {scenes.length}</span>
              </div>
            </div>
            
            <button
              onClick={handleGeneratePlotSuggestions}
              className="btn-primary bg-gradient-to-r from-purple-500 to-pink-500"
            >
              🎯 Generate Plot Ideas
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="glass-card p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              💬 Character Chat
            </button>
            <button
              onClick={() => setActiveTab('memory')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'memory'
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              🧠 Memory Manager
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              📊 Memory Analytics
            </button>
          </div>
        </div>

        {/* Entity Selection */}
        <div className="glass-card p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Entity for AI Operations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* World Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">World</label>
              <button
                onClick={() => handleEntitySelect('world', world.id, world.name)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedEntity?.type === 'world' && selectedEntity?.id === world.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="font-medium">{world.name}</div>
                <div className="text-xs opacity-75">{world.type}</div>
              </button>
            </div>

            {/* Character Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Characters</label>
              <select
                value={selectedEntity?.type === 'character' ? selectedEntity.id : ''}
                onChange={(e) => {
                  const charId = e.target.value;
                  if (charId) {
                    const character = characters.find(c => c.id === charId);
                    if (character) {
                      handleEntitySelect('character', charId, character.name);
                    }
                  }
                }}
                className="input-field"
              >
                <option value="">Choose a character...</option>
                {characters.map(character => (
                  <option key={character.id} value={character.id}>
                    {character.name} ({character.species})
                  </option>
                ))}
              </select>
            </div>

            {/* Scene Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Scenes</label>
              <select
                value={selectedEntity?.type === 'scene' ? selectedEntity.id : ''}
                onChange={(e) => {
                  const sceneId = e.target.value;
                  if (sceneId) {
                    const scene = scenes.find(s => s.id === sceneId);
                    if (scene) {
                      handleEntitySelect('scene', sceneId, scene.title);
                    }
                  }
                }}
                className="input-field"
              >
                <option value="">Choose a scene...</option>
                {scenes.map(scene => (
                  <option key={scene.id} value={scene.id}>
                    {scene.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedEntity && (
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Selected:</span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500">
                  {selectedEntity.type.toUpperCase()}
                </span>
                <span className="text-gray-300">{selectedEntity.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="min-h-[600px]">
          {activeTab === 'chat' && (
            <div className="glass-card p-6">
              <CharacterChatSimulator
                worldId={worldId!}
                characterId={selectedEntity?.type === 'character' ? selectedEntity.id : undefined}
                sceneContext={selectedEntity?.type === 'scene' ? selectedEntity.name : undefined}
              />
            </div>
          )}

          {activeTab === 'memory' && selectedEntity && (
            <div className="glass-card p-6">
              <MemoryManager
                entityType={selectedEntity.type}
                entityId={selectedEntity.id}
                onMemoryUpdate={(memories) => {
                  console.log('Memories updated:', memories);
                }}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4">📊 Memory Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{characters.length}</div>
                  <div className="text-sm text-gray-400">Characters</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{scenes.length}</div>
                  <div className="text-sm text-gray-400">Scenes</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">0</div>
                  <div className="text-sm text-gray-400">Total Memories</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">0</div>
                  <div className="text-sm text-gray-400">Active Memories</div>
                </div>
              </div>

              <div className="text-center text-gray-400">
                <p>Memory analytics will be available once you create memories for your entities.</p>
                <p className="text-sm mt-2">Switch to the Memory Manager tab to start creating memories.</p>
              </div>
            </div>
          )}

          {activeTab === 'memory' && !selectedEntity && (
            <div className="glass-card p-6 text-center">
              <p className="text-gray-400">Please select an entity to manage its memories.</p>
            </div>
          )}
        </div>

        {/* AI Features Overview */}
        <div className="glass-card p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">🚀 AI Features Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-2xl mb-2">🧠</div>
              <h4 className="font-semibold mb-2">Memory Engine</h4>
              <p className="text-sm text-gray-400">
                Store and manage contextual memories for characters, worlds, and scenes with versioning and relevance scoring.
              </p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-2xl mb-2">💬</div>
              <h4 className="font-semibold mb-2">Character Chat</h4>
              <p className="text-sm text-gray-400">
                Chat with AI-powered characters that remember past interactions and respond based on their personality and memories.
              </p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-2xl mb-2">🏷️</div>
              <h4 className="font-semibold mb-2">Smart Tagging</h4>
              <p className="text-sm text-gray-400">
                Automatically tag memories with emotions, plot elements, lore, and relationships for better organization.
              </p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-2xl mb-2">📝</div>
              <h4 className="font-semibold mb-2">Context Building</h4>
              <p className="text-sm text-gray-400">
                AI automatically builds context from relevant memories to generate more coherent and consistent responses.
              </p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-semibold mb-2">Plot Suggestions</h4>
              <p className="text-sm text-gray-400">
                Generate plot development suggestions based on current story context and character arcs.
              </p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-semibold mb-2">Memory Analytics</h4>
              <p className="text-sm text-gray-400">
                Track memory usage, relevance scores, and learning patterns to optimize your storytelling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIIntegration; 