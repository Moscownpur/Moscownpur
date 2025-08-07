import React, { useState, useEffect, useRef } from 'react';
import { Character, CharacterChatResponse, EntitySummary } from '../../types/ai';
import { aiMemoryEngine } from '../../lib/aiMemoryEngine';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface CharacterChatSimulatorProps {
  worldId: string;
  characterId?: string;
  sceneContext?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  memories_used?: string[];
  emotion_detected?: string;
}

const CharacterChatSimulator: React.FC<CharacterChatSimulatorProps> = ({
  worldId,
  characterId,
  sceneContext
}) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMemories, setActiveMemories] = useState<EntitySummary[]>([]);
  const [showMemoryPanel, setShowMemoryPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCharacters();
    if (characterId) {
      loadCharacter(characterId);
    }
  }, [worldId, characterId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadCharacters = async () => {
    try {
      const { data } = await supabase
        .from('characters')
        .select('*')
        .eq('world_id', worldId);
      
      setCharacters(data || []);
    } catch (error) {
      console.error('Error loading characters:', error);
    }
  };

  const loadCharacter = async (charId: string) => {
    try {
      const { data } = await supabase
        .from('characters')
        .select('*')
        .eq('id', charId)
        .single();
      
      if (data) {
        setSelectedCharacter(data);
        // Load character memories
        const memories = await aiMemoryEngine.getEntitySummaries('character', charId, { used_recently: true });
        setActiveMemories(memories);
      }
    } catch (error) {
      console.error('Error loading character:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedCharacter || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiMemoryEngine.chatWithCharacter(
        selectedCharacter.id,
        inputMessage,
        worldId,
        sceneContext
      );

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.text,
        timestamp: new Date(),
        memories_used: response.memories_used,
        emotion_detected: response.emotion_detected
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update active memories
      if (response.memories_used.length > 0) {
        const updatedMemories = await aiMemoryEngine.getEntitySummaries('character', selectedCharacter.id, { used_recently: true });
        setActiveMemories(updatedMemories);
      }

      toast.success('Character responded!');
    } catch (error) {
      toast.error('Failed to get character response');
      console.error('Error in character chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'joy': return 'text-green-400';
      case 'sadness': return 'text-blue-400';
      case 'anger': return 'text-red-400';
      case 'fear': return 'text-purple-400';
      case 'surprise': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'joy': return '😊';
      case 'sadness': return '😢';
      case 'anger': return '😠';
      case 'fear': return '😨';
      case 'surprise': return '😲';
      default: return '😐';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="glass-card p-4 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold gradient-text-cosmic">
            💬 Character Chat Simulator
          </h3>
          <button
            onClick={() => setShowMemoryPanel(!showMemoryPanel)}
            className="btn-secondary text-sm"
          >
            {showMemoryPanel ? 'Hide' : 'Show'} Memories
          </button>
        </div>

        {/* Character Selection */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Select Character</label>
          <select
            value={selectedCharacter?.id || ''}
            onChange={(e) => {
              const charId = e.target.value;
              if (charId) {
                loadCharacter(charId);
              } else {
                setSelectedCharacter(null);
                setActiveMemories([]);
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

        {/* Character Info */}
        {selectedCharacter && (
          <div className="mt-4 p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {selectedCharacter.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold">{selectedCharacter.name}</h4>
                <p className="text-sm text-gray-400">
                  {selectedCharacter.species} • {selectedCharacter.profession}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedCharacter.arc_summary.substring(0, 100)}...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex gap-4">
        {/* Chat Messages */}
        <div className="flex-1 flex flex-col">
          <div className="glass-card flex-1 flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-8">
                  {selectedCharacter 
                    ? `Start chatting with ${selectedCharacter.name}!`
                    : 'Select a character to start chatting'
                  }
                </div>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          : 'bg-gray-700 text-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      
                      {message.type === 'ai' && message.emotion_detected && (
                        <div className="flex items-center gap-1 mt-2 text-xs">
                          <span className={getEmotionColor(message.emotion_detected)}>
                            {getEmotionIcon(message.emotion_detected)}
                          </span>
                          <span className={getEmotionColor(message.emotion_detected)}>
                            {message.emotion_detected}
                          </span>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-400 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-600">
              <div className="flex gap-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedCharacter 
                    ? `Chat with ${selectedCharacter.name}...`
                    : 'Select a character first...'
                  }
                  disabled={!selectedCharacter || isLoading}
                  className="input-field flex-1 resize-none"
                  rows={2}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || !selectedCharacter || isLoading}
                  className="btn-primary bg-gradient-to-r from-green-500 to-teal-500 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Memory Panel */}
        {showMemoryPanel && (
          <div className="w-80 glass-card p-4">
            <h4 className="text-lg font-semibold mb-4">🧠 Active Memories</h4>
            
            {activeMemories.length === 0 ? (
              <p className="text-gray-400 text-sm">No active memories</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activeMemories.map(memory => (
                  <div key={memory.id} className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        memory.memory_type === 'hard' ? 'bg-blue-500' :
                        memory.memory_type === 'soft' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}>
                        {memory.memory_type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400">
                        {Math.round(memory.relevance_score * 100)}% relevant
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-2">
                      {memory.summary_text}
                    </p>
                    
                    {memory.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterChatSimulator; 