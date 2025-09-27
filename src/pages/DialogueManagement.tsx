import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Search, Filter, SortAsc, SortDesc, Globe, BookOpen, Film } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Dialogue, DeliveryType } from '../types/dialogue';
import DialogueComponent from '../components/DialogueComponent';
import DialogueForm from '../components/DialogueForm';
import toast from 'react-hot-toast';

interface Character {
  character_id: string;
  name: string;
  traits?: any;
}

interface Scene {
  scene_id: string;
  title: string;
  event_id: string;
}

interface Event {
  event_id: string;
  title: string;
  chapter_id: string;
}

interface Chapter {
  chapter_id: string;
  title: string;
  world_id: string;
}

interface World {
  world_id: string;
  name: string;
}

interface DialogueWithContext extends Dialogue {
  character?: Character;
  scene?: Scene;
  event?: Event;
  chapter?: Chapter;
  world?: World;
}

const DialogueManagement: React.FC = () => {
  const { user } = useAuth();
  const [dialogues, setDialogues] = useState<DialogueWithContext[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDialogue, setEditingDialogue] = useState<Dialogue | null>(null);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterWorld, setFilterWorld] = useState<string>('all');
  const [filterChapter, setFilterChapter] = useState<string>('all');
  const [filterScene, setFilterScene] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'sequence' | 'created_at' | 'updated_at'>('sequence');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);



  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // First, get user's worlds
      const { data: worldsData, error: worldsError } = await supabase
        .from('worlds')
        .select('*')
        .eq('user_id', user?.id);

      if (worldsError) throw worldsError;
      if (!worldsData || worldsData.length === 0) {
        setWorlds([]);
        setChapters([]);
        setEvents([]);
        setScenes([]);
        setCharacters([]);
        setDialogues([]);
        setLoading(false);
        return;
      }

      const userWorldIds = worldsData.map(w => w.world_id);
      setWorlds(worldsData);

      // Fetch chapters in user's worlds
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('chapters')
        .select('*')
        .in('world_id', userWorldIds);

      if (chaptersError) throw chaptersError;
      if (chaptersData) setChapters(chaptersData);

      // Fetch events in user's chapters
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .in('chapter_id', chaptersData?.map(c => c.chapter_id) || []);

      if (eventsError) throw eventsError;
      if (eventsData) setEvents(eventsData);

      // Fetch scenes in user's events
      const { data: scenesData, error: scenesError } = await supabase
        .from('scenes')
        .select('*')
        .in('event_id', eventsData?.map(e => e.event_id) || []);

      if (scenesError) throw scenesError;
      if (scenesData) setScenes(scenesData);

      // Fetch characters in user's worlds
      const { data: charactersData, error: charactersError } = await supabase
        .from('characters')
        .select('*')
        .in('world_id', userWorldIds);

      if (charactersError) throw charactersError;
      if (charactersData) setCharacters(charactersData);

      // Fetch dialogues in user's scenes
      const { data: dialoguesData, error: dialoguesError } = await supabase
        .from('dialogues')
        .select('*')
        .in('scene_id', scenesData?.map(s => s.scene_id) || [])
        .order('sequence', { ascending: true });

      if (dialoguesError) throw dialoguesError;
      if (dialoguesData) {
        // Enrich dialogues with context
        const enrichedDialogues = dialoguesData.map(dialogue => {
          const scene = scenesData?.find(s => s.scene_id === dialogue.scene_id);
          const event = eventsData?.find(e => e.event_id === scene?.event_id);
          const chapter = chaptersData?.find(c => c.chapter_id === event?.chapter_id);
          const world = worldsData?.find(w => w.world_id === chapter?.world_id);
          const character = charactersData?.find(c => c.character_id === dialogue.character_id);

          return {
            ...dialogue,
            scene,
            event,
            chapter,
            world,
            character
          };
        });
        setDialogues(enrichedDialogues);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dialogue data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDialogue = async (dialogueData: Omit<Dialogue, 'dialogue_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('dialogues')
        .insert([dialogueData])
        .select()
        .single();

      if (error) {
        console.error('Error adding dialogue:', error);
        
        if (error.code === '23503') {
          toast.error('Invalid reference. The scene or character does not exist.');
        } else if (error.code === '23514') {
          toast.error('Validation error. Please check the data being added.');
        } else {
          toast.error(`Failed to add dialogue: ${error.message || 'Unknown error'}`);
        }
        
        throw error;
      }

      if (data) {
        // Enrich the new dialogue with context
        const scene = scenes.find(s => s.scene_id === data.scene_id);
        const event = events.find(e => e.event_id === scene?.event_id);
        const chapter = chapters.find(c => c.chapter_id === event?.chapter_id);
        const world = worlds.find(w => w.world_id === chapter?.world_id);
        const character = characters.find(c => c.character_id === data.character_id);

        const enrichedDialogue: DialogueWithContext = {
          ...data,
          scene,
          event,
          chapter,
          world,
          character
        };

        setDialogues(prev => [...prev, enrichedDialogue]);
        toast.success('Dialogue added successfully');
      }
    } catch (error) {
      console.error('Error adding dialogue:', error);
      toast.error('Failed to add dialogue');
    }
  };

  const handleUpdateDialogue = async (dialogue: Dialogue) => {
    try {
      // Only update the fields that should be updated, excluding system fields
      const updateData = {
        scene_id: dialogue.scene_id,
        character_id: dialogue.character_id || null,
        content: dialogue.content,
        delivery_type: dialogue.delivery_type,
        sequence: dialogue.sequence,
        sentiment_score: dialogue.sentiment_score || null
      };

      // Validate the data
      if (!updateData.scene_id) {
        toast.error('Scene ID is required');
        return;
      }
      
      if (!updateData.content || updateData.content.trim() === '') {
        toast.error('Content is required');
        return;
      }
      
      if (!updateData.delivery_type) {
        toast.error('Delivery type is required');
        return;
      }
      
      if (!updateData.sequence || updateData.sequence < 1) {
        toast.error('Sequence must be at least 1');
        return;
      }

      // Perform the update
      const { data, error } = await supabase
        .from('dialogues')
        .update(updateData)
        .eq('dialogue_id', dialogue.dialogue_id)
        .select()
        .single();

      if (error) {
        console.error('Error updating dialogue:', error);
        
        if (error.code === '23503') {
          toast.error('Invalid reference. The scene or character does not exist.');
        } else if (error.code === '23514') {
          toast.error('Validation error. Please check the data being updated.');
        } else {
          toast.error(`Update failed: ${error.message || 'Unknown error'}`);
        }
        
        throw error;
      }

      if (data) {
        setDialogues(prev => prev.map(d => 
          d.dialogue_id === dialogue.dialogue_id 
            ? { ...d, ...data }
            : d
        ));
        toast.success('Dialogue updated successfully');
      }
    } catch (error) {
      console.error('Error updating dialogue:', error);
      toast.error('Failed to update dialogue');
    }
  };

  const handleDeleteDialogue = async (dialogueId: string) => {
    try {
      const { error } = await supabase
        .from('dialogues')
        .delete()
        .eq('dialogue_id', dialogueId);

      if (error) throw error;

      setDialogues(prev => prev.filter(d => d.dialogue_id !== dialogueId));
      toast.success('Dialogue deleted successfully');
    } catch (error) {
      console.error('Error deleting dialogue:', error);
      toast.error('Failed to delete dialogue');
    }
  };

  // Filter and sort dialogues
  const filteredAndSortedDialogues = dialogues
    .filter(dialogue => {
      // Search filter
      if (searchTerm && !dialogue.content.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Type filter
      if (filterType !== 'all' && dialogue.delivery_type !== filterType) {
        return false;
      }
      
      // World filter
      if (filterWorld !== 'all' && dialogue.world?.world_id !== filterWorld) {
        return false;
      }
      
      // Chapter filter
      if (filterChapter !== 'all' && dialogue.chapter?.chapter_id !== filterChapter) {
        return false;
      }
      
      // Scene filter
      if (filterScene !== 'all' && dialogue.scene?.scene_id !== filterScene) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'sequence':
          aValue = a.sequence;
          bValue = b.sequence;
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'updated_at':
          aValue = new Date(a.updated_at);
          bValue = new Date(b.updated_at);
          break;
        default:
          aValue = a.sequence;
          bValue = b.sequence;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const getFilteredChapters = () => {
    if (filterWorld === 'all') return chapters;
    return chapters.filter(c => c.world_id === filterWorld);
  };

  const getFilteredEvents = () => {
    if (filterChapter === 'all') return events;
    return events.filter(e => e.chapter_id === filterChapter);
  };

  const getFilteredScenes = () => {
    if (filterEvent === 'all') return scenes;
    return scenes.filter(s => s.event_id === filterEvent);
  };

  const getFilteredEvent = () => {
    if (filterChapter === 'all') return 'all';
    return filterEvent;
  };

  const filterEvent = filterChapter !== 'all' ? filterScene : 'all';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-white/20 border-t-white/80"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text-cosmic mb-2">
            Dialogue Management
          </h1>
          <p className="text-white/60 text-lg">
            Manage all dialogues across your storytelling universe
          </p>
        </div>
        
        <button
          onClick={() => {
            if (scenes.length === 0) {
              toast.error('No scenes available. Please create a scene first.');
              return;
            }
            if (characters.length === 0) {
              toast('No characters available. You can still add narration dialogues.', { icon: '⚠️' });
            }
            setIsFormOpen(true);
          }}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
            scenes.length === 0 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105'
          }`}
          disabled={scenes.length === 0}
        >
          <Plus className="w-5 h-5" />
          <span>Add Dialogue</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 text-center">
          <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{dialogues.length}</div>
          <div className="text-white/60">Total Dialogues</div>
        </div>
        
        <div className="glass-card rounded-2xl p-6 text-center">
          <Globe className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{worlds.length}</div>
          <div className="text-white/60">Active Worlds</div>
        </div>
        
        <div className="glass-card rounded-2xl p-6 text-center">
          <BookOpen className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{chapters.length}</div>
          <div className="text-white/60">Total Chapters</div>
        </div>
        
        <div className="glass-card rounded-2xl p-6 text-center">
          <Film className="w-8 h-8 text-orange-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{scenes.length}</div>
          <div className="text-white/60">Total Scenes</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass-card rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="w-5 h-5 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dialogues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="speech_bubble">Speech</option>
              <option value="narration">Narration</option>
              <option value="thought">Thoughts</option>
              <option value="song">Songs</option>
            </select>
          </div>

          {/* World Filter */}
          <div>
            <select
              value={filterWorld}
              onChange={(e) => {
                setFilterWorld(e.target.value);
                setFilterChapter('all');
                setFilterScene('all');
              }}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Worlds</option>
              {worlds.map(world => (
                <option key={world.world_id} value={world.world_id}>
                  {world.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chapter Filter */}
          <div>
            <select
              value={filterChapter}
              onChange={(e) => {
                setFilterChapter(e.target.value);
                setFilterScene('all');
              }}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Chapters</option>
              {getFilteredChapters().map(chapter => (
                <option key={chapter.chapter_id} value={chapter.chapter_id}>
                  {chapter.title}
                </option>
              ))}
            </select>
          </div>

          {/* Scene Filter */}
          <div>
            <select
              value={filterScene}
              onChange={(e) => setFilterScene(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Scenes</option>
              {getFilteredScenes().map(scene => (
                <option key={scene.scene_id} value={scene.scene_id}>
                  {scene.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-white/20">
          <span className="text-white/60">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="sequence">Sequence</option>
            <option value="created_at">Created Date</option>
            <option value="updated_at">Updated Date</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center space-x-1 text-white/60 hover:text-white transition-colors"
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </button>
        </div>
      </div>

      {/* Dialogues List */}
      <div className="space-y-4">
        {filteredAndSortedDialogues.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <MessageSquare className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No dialogues found</h3>
            <p className="text-white/60 mb-6">
              {searchTerm || filterType !== 'all' || filterWorld !== 'all' || filterChapter !== 'all' || filterScene !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Start building your story by adding dialogues to your scenes.'
              }
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300"
            >
              Add First Dialogue
            </button>
          </div>
        ) : (
          filteredAndSortedDialogues.map((dialogue) => (
            <div key={dialogue.dialogue_id} className="glass-card rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm text-white/60">#{dialogue.sequence}</span>
                    {dialogue.world && (
                      <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                        {dialogue.world.name}
                      </span>
                    )}
                    {dialogue.chapter && (
                      <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                        {dialogue.chapter.title}
                      </span>
                    )}
                    {dialogue.scene && (
                      <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded-full">
                        {dialogue.scene.title}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingDialogue(dialogue);
                      setIsFormOpen(true);
                    }}
                    className="px-3 py-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDialogue(dialogue.dialogue_id)}
                    className="px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <DialogueComponent
                dialogue={dialogue}
                character={dialogue.character}
                onEdit={() => {
                  setEditingDialogue(dialogue);
                  setIsFormOpen(true);
                }}
                onDelete={handleDeleteDialogue}
                isEditable={false}
              />
            </div>
          ))
        )}
      </div>

      {/* Dialogue Form Modal */}
      {isFormOpen && (
        <DialogueForm
          sceneId={filterScene !== 'all' ? filterScene : (scenes.length > 0 ? scenes[0].scene_id : '')}
          characters={characters}
          scenes={scenes}
          events={events}
          chapters={chapters}
          worlds={worlds}
          existingDialogues={dialogues}
          onSave={handleAddDialogue}
          onUpdate={handleUpdateDialogue}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingDialogue(null);
          }}
          editingDialogue={editingDialogue}
          isOpen={isFormOpen}
        />
      )}
    </div>
  );
};

export default DialogueManagement;
