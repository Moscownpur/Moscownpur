import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronRight, ChevronDown, MessageSquare, BookOpen, MapPin, Film, Layers } from 'lucide-react';
import DialogueComponent from '../../components/DialogueComponent';
import DialogueForm from '../../components/DialogueForm';
import { Dialogue } from '../../types/dialogue';
import toast from 'react-hot-toast';

// Types for the hierarchy
interface Scene {
    scene_id: string;
    title: string;
    event_id: string;
}

interface Event {
    event_id: string;
    title: string;
    chapter_id: string;
    scenes?: Scene[];
}

interface Chapter {
    chapter_id: string;
    title: string;
    world_id: string;
    events?: Event[];
}

interface World {
    world_id: string;
    name: string;
    chapters?: Chapter[];
}

const StoryEditor: React.FC = () => {
    const { user } = useAuth();
    const [hierarchy, setHierarchy] = useState<World[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
    const [dialogues, setDialogues] = useState<Dialogue[]>([]);

    // Expanded states for accordion
    const [expandedWorlds, setExpandedWorlds] = useState<Set<string>>(new Set());
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
    const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

    // Dialogue Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingDialogue, setEditingDialogue] = useState<Dialogue | null>(null);
    const [characters, setCharacters] = useState<any[]>([]); // Simplified for now

    useEffect(() => {
        if (user) {
            fetchHierarchy();
            fetchCharacters();
        }
    }, [user]);

    useEffect(() => {
        if (selectedScene) {
            fetchDialogues(selectedScene.scene_id);
        }
    }, [selectedScene]);

    const fetchHierarchy = async () => {
        try {
            setLoading(true);

            // Fetch all data levels
            // Note: In a production app with huge data, we might want to lazy load these levels
            // But for now, fetching all for the user is acceptable for a smooth UI

            const { data: worlds } = await supabase
                .from('worlds')
                .select('*')
                .eq('user_id', user?.id);

            if (!worlds) {
                setHierarchy([]);
                return;
            }

            const worldIds = worlds.map(w => w.world_id);

            const { data: chapters } = await supabase
                .from('chapters')
                .select('*')
                .in('world_id', worldIds);

            const chapterIds = chapters?.map(c => c.chapter_id) || [];

            const { data: events } = await supabase
                .from('events')
                .select('*')
                .in('chapter_id', chapterIds);

            const eventIds = events?.map(e => e.event_id) || [];

            const { data: scenes } = await supabase
                .from('scenes')
                .select('*')
                .in('event_id', eventIds);

            // Build the tree
            const builtHierarchy = worlds.map(world => ({
                ...world,
                chapters: chapters
                    ?.filter(c => c.world_id === world.world_id)
                    .map(chapter => ({
                        ...chapter,
                        events: events
                            ?.filter(e => e.chapter_id === chapter.chapter_id)
                            .map(event => ({
                                ...event,
                                scenes: scenes?.filter(s => s.event_id === event.event_id) || []
                            })) || []
                    })) || []
            }));

            setHierarchy(builtHierarchy);
        } catch (error) {
            console.error('Error fetching hierarchy:', error);
            toast.error('Failed to load story structure');
        } finally {
            setLoading(false);
        }
    };

    const fetchCharacters = async () => {
        // Fetch characters for dropdowns
        const { data } = await supabase.from('characters').select('*');
        if (data) setCharacters(data);
    };

    const fetchDialogues = async (sceneId: string) => {
        try {
            const { data, error } = await supabase
                .from('dialogues')
                .select('*')
                .eq('scene_id', sceneId)
                .order('sequence', { ascending: true });

            if (error) throw error;
            setDialogues(data || []);
        } catch (error) {
            console.error('Error fetching dialogues:', error);
            toast.error('Failed to load dialogues');
        }
    };

    const toggleExpanded = (set: Set<string>, setter: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) => {
        const newSet = new Set(set);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setter(newSet);
    };

    // Dialogue Handlers (Reused from DialogueManagement)
    const handleAddDialogue = async (dialogueData: any) => {
        try {
            const { data, error } = await supabase
                .from('dialogues')
                .insert([dialogueData])
                .select()
                .single();

            if (error) throw error;

            if (data) {
                setDialogues(prev => [...prev, data]);
                toast.success('Dialogue added');
                setIsFormOpen(false);
            }
        } catch (error) {
            console.error('Error adding dialogue:', error);
            toast.error('Failed to add dialogue');
        }
    };

    const handleUpdateDialogue = async (dialogue: Dialogue) => {
        try {
            const { data, error } = await supabase
                .from('dialogues')
                .update({
                    content: dialogue.content,
                    delivery_type: dialogue.delivery_type,
                    character_id: dialogue.character_id,
                    sequence: dialogue.sequence,
                    sentiment_score: dialogue.sentiment_score
                })
                .eq('dialogue_id', dialogue.dialogue_id)
                .select()
                .single();

            if (error) throw error;

            if (data) {
                setDialogues(prev => prev.map(d => d.dialogue_id === dialogue.dialogue_id ? data : d));
                toast.success('Dialogue updated');
                setIsFormOpen(false);
                setEditingDialogue(null);
            }
        } catch (error) {
            console.error('Error updating dialogue:', error);
            toast.error('Failed to update dialogue');
        }
    };

    const handleDeleteDialogue = async (id: string) => {
        try {
            const { error } = await supabase.from('dialogues').delete().eq('dialogue_id', id);
            if (error) throw error;
            setDialogues(prev => prev.filter(d => d.dialogue_id !== id));
            toast.success('Dialogue deleted');
        } catch (error) {
            console.error('Error deleting dialogue:', error);
            toast.error('Failed to delete dialogue');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-2 border-white/20 border-t-white/80"></div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6">
            {/* Sidebar Navigation */}
            <div className="w-1/3 glass-card rounded-2xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-white/10 bg-white/5">
                    <h2 className="text-xl font-bold gradient-text-cosmic flex items-center gap-2">
                        <Layers className="w-5 h-5" />
                        Story Structure
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {hierarchy.map(world => (
                        <div key={world.world_id} className="mb-1">
                            <button
                                onClick={() => toggleExpanded(expandedWorlds, setExpandedWorlds, world.world_id)}
                                className="w-full flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition-colors text-left group"
                            >
                                {expandedWorlds.has(world.world_id) ? (
                                    <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white/80" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/80" />
                                )}
                                <BookOpen className="w-4 h-4 text-blue-400" />
                                <span className="font-medium text-white/90 truncate">{world.name}</span>
                            </button>

                            {expandedWorlds.has(world.world_id) && (
                                <div className="ml-4 pl-2 border-l border-white/10 mt-1 space-y-1">
                                    {world.chapters?.map(chapter => (
                                        <div key={chapter.chapter_id}>
                                            <button
                                                onClick={() => toggleExpanded(expandedChapters, setExpandedChapters, chapter.chapter_id)}
                                                className="w-full flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition-colors text-left group"
                                            >
                                                {expandedChapters.has(chapter.chapter_id) ? (
                                                    <ChevronDown className="w-3 h-3 text-white/30 group-hover:text-white/70" />
                                                ) : (
                                                    <ChevronRight className="w-3 h-3 text-white/30 group-hover:text-white/70" />
                                                )}
                                                <span className="text-sm text-white/80 truncate">{chapter.title}</span>
                                            </button>

                                            {expandedChapters.has(chapter.chapter_id) && (
                                                <div className="ml-4 pl-2 border-l border-white/10 mt-1 space-y-1">
                                                    {chapter.events?.map(event => (
                                                        <div key={event.event_id}>
                                                            <button
                                                                onClick={() => toggleExpanded(expandedEvents, setExpandedEvents, event.event_id)}
                                                                className="w-full flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition-colors text-left group"
                                                            >
                                                                {expandedEvents.has(event.event_id) ? (
                                                                    <ChevronDown className="w-3 h-3 text-white/30 group-hover:text-white/70" />
                                                                ) : (
                                                                    <ChevronRight className="w-3 h-3 text-white/30 group-hover:text-white/70" />
                                                                )}
                                                                <MapPin className="w-3 h-3 text-orange-400/70" />
                                                                <span className="text-sm text-white/70 truncate">{event.title}</span>
                                                            </button>

                                                            {expandedEvents.has(event.event_id) && (
                                                                <div className="ml-4 pl-2 border-l border-white/10 mt-1 space-y-1">
                                                                    {event.scenes?.map(scene => (
                                                                        <button
                                                                            key={scene.scene_id}
                                                                            onClick={() => setSelectedScene(scene)}
                                                                            className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-left text-sm ${selectedScene?.scene_id === scene.scene_id
                                                                                    ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30'
                                                                                    : 'hover:bg-white/5 text-white/60 hover:text-white/90'
                                                                                }`}
                                                                        >
                                                                            <Film className="w-3 h-3" />
                                                                            <span className="truncate">{scene.title}</span>
                                                                        </button>
                                                                    ))}
                                                                    {(!event.scenes || event.scenes.length === 0) && (
                                                                        <div className="p-2 text-xs text-white/30 italic ml-6">No scenes</div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {(!chapter.events || chapter.events.length === 0) && (
                                                        <div className="p-2 text-xs text-white/30 italic ml-6">No events</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {(!world.chapters || world.chapters.length === 0) && (
                                        <div className="p-2 text-xs text-white/30 italic ml-6">No chapters</div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {hierarchy.length === 0 && (
                        <div className="p-4 text-center text-white/40 text-sm">
                            No worlds found. Create a world first!
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 glass-card rounded-2xl overflow-hidden flex flex-col">
                {selectedScene ? (
                    <>
                        <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">{selectedScene.title}</h2>
                                <div className="flex items-center gap-2 text-sm text-white/40">
                                    <Film className="w-4 h-4" />
                                    <span>Scene Dialogue Editor</span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingDialogue(null);
                                    setIsFormOpen(true);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:scale-105 transition-all"
                            >
                                Add Dialogue
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/20">
                            {dialogues.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-white/30">
                                    <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
                                    <p>No dialogues yet. Start the conversation!</p>
                                </div>
                            ) : (
                                dialogues.map(dialogue => (
                                    <div key={dialogue.dialogue_id} className="relative group">
                                        <DialogueComponent
                                            dialogue={dialogue}
                                            character={characters.find(c => c.character_id === dialogue.character_id)}
                                            onEdit={() => {
                                                setEditingDialogue(dialogue);
                                                setIsFormOpen(true);
                                            }}
                                            onDelete={handleDeleteDialogue}
                                            isEditable={true}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/40">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Layers className="w-10 h-10 opacity-50" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">Select a Scene</h3>
                        <p className="max-w-md text-center">
                            Navigate through your worlds, chapters, and events in the sidebar to select a scene and edit its dialogues.
                        </p>
                    </div>
                )}
            </div>

            {/* Dialogue Form Modal */}
            {isFormOpen && selectedScene && (
                <DialogueForm
                    isOpen={isFormOpen}
                    onCancel={() => {
                        setIsFormOpen(false);
                        setEditingDialogue(null);
                    }}
                    onSave={handleAddDialogue}
                    onUpdate={handleUpdateDialogue}
                    editingDialogue={editingDialogue}
                    sceneId={selectedScene.scene_id}
                    characters={characters} // Pass all characters for now, ideally filter by world
                    scenes={[selectedScene]} // Only current scene available
                    events={[]} // Not needed for simple add
                    chapters={[]} // Not needed
                    worlds={[]} // Not needed
                    existingDialogues={dialogues}
                />
            )}
        </div>
    );
};

export default StoryEditor;
