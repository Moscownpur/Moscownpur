import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Film, Users, MapPin, Clock, MessageSquare, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Scene, Character, SceneWithDialogue } from '../../types';
import DialogueList from '../../components/DialogueList';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import { useDialogues } from '../../hooks/useDialogues';

const SceneDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [scene, setScene] = useState<SceneWithDialogue | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialogueManager, setShowDialogueManager] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Use our custom dialogue hook
  const {
    dialogues,
    loading: dialoguesLoading,
    error: dialoguesError,
    addDialogue,
    updateDialogue,
    deleteDialogue,
    refreshDialogues
  } = useDialogues(id || '');

  useEffect(() => {
    if (id && user) {
      fetchSceneData();
    }
  }, [id, user]);

  const fetchSceneData = async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }

      // Fetch scene with dialogue lines
      const { data: sceneData, error: sceneError } = await supabase
        .from('scenes_with_dialogue')
        .select('*')
        .eq('id', id)
        .single();

      if (sceneError) throw sceneError;

      // Fetch characters in this scene
      const { data: characterData, error: characterError } = await supabase
        .from('scene_characters')
        .select(`
          characters (*)
        `)
        .eq('scene_id', id);

      if (characterError) throw characterError;

      setScene(sceneData);
      setCharacters(characterData.map((sc: any) => sc.characters).filter(Boolean));
    } catch (error) {
      console.error('Error fetching scene data:', error);
      toast.error('Failed to load scene');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScene = async () => {
    if (!scene || !supabase) return;

    try {
      const { error } = await supabase
        .from('scenes')
        .delete()
        .eq('id', scene.id)
        .eq('created_by', user?.id);

      if (error) throw error;

      toast.success('Scene deleted successfully');
      // Redirect to scene management
      window.location.href = '/dashboard/scenes';
    } catch (error) {
      console.error('Error deleting scene:', error);
      toast.error('Failed to delete scene');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-white/20 border-t-white/80"></div>
      </div>
    );
  }

  if (!scene) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <h2 className="text-heading gradient-text-cosmic mb-4">
            Scene not found
          </h2>
          <p className="text-body text-white/60 mb-8">
            The requested scene could not be loaded.
          </p>
          <Link to="/dashboard/scenes">
                            <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:scale-105 smooth-transition soft-glow-orange">
                  Back to Scenes
                </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/scenes">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 glass-card rounded-xl hover:soft-glow smooth-transition"
            >
              <ArrowLeft className="w-6 h-6 text-white/80" />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-display gradient-text-cosmic mb-2">
              {scene.title}
            </h1>
            <p className="text-body text-white/60">
              Scene {scene.scene_order} • Created {new Date(scene.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDialogueManager(!showDialogueManager)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:scale-105 smooth-transition soft-glow-orange flex items-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            {showDialogueManager ? 'Hide' : 'Manage'} Dialogues
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEditModal(true)}
            className="p-3 glass-card rounded-xl hover:soft-glow smooth-transition"
          >
            <Edit2 className="w-5 h-5 text-white/80" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDeleteScene}
            className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl smooth-transition"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Scene Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scene Description */}
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 glass-card rounded-xl">
                <Film className="w-7 h-7 text-white/80" />
              </div>
              <h2 className="text-heading gradient-text-cosmic">Scene Description</h2>
            </div>
            <p className="text-body text-white/80 leading-relaxed">
              {scene.description || 'No description provided for this scene.'}
            </p>
          </div>

          {/* Dialogue Manager */}
          {showDialogueManager && (
            <div className="glass-card rounded-2xl p-8">
              {dialoguesError && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">Error loading dialogues: {dialoguesError}</p>
                </div>
              )}
              <DialogueList
                sceneId={scene.id}
                dialogues={dialogues}
                characters={characters}
                onAddDialogue={addDialogue}
                onUpdateDialogue={updateDialogue}
                onDeleteDialogue={deleteDialogue}
                isEditable={true}
              />
            </div>
          )}

          {/* Dialogue Preview */}
          {!showDialogueManager && dialogues.length > 0 && (
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-7 h-7 text-blue-400" />
                <h2 className="text-heading gradient-text-cosmic">Scene Dialogue</h2>
                <span className="px-3 py-1 text-caption font-medium glass-card text-white/80 rounded-full">
                  {dialogues.length} dialogue{dialogues.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-4">
                {dialogues.map((dialogue) => (
                  <div key={dialogue.dialogue_id} className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-white/80">
                        {dialogue.character_id 
                          ? `@${characters.find(c => c.id === dialogue.character_id)?.name || 'Unknown'}`
                          : 'Narration'
                        }
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full border border-blue-400/20 bg-blue-400/10 text-blue-400 capitalize">
                        {dialogue.delivery_type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className={`${dialogue.delivery_type === 'narration' ? 'italic text-white/70' : 'text-white'}`}>
                      {dialogue.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Scene Info */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-subheading text-white mb-4">Scene Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-caption text-white/60">Order</p>
                  <p className="text-body text-white">Scene {scene.scene_order}</p>
                </div>
              </div>
              
              {scene.region_id && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="text-caption text-white/60">Location</p>
                    <p className="text-body text-white">Region ID: {scene.region_id}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-caption text-white/60">Characters</p>
                  <p className="text-body text-white">{characters.length} in scene</p>
                </div>
              </div>
            </div>
          </div>

          {/* Characters in Scene */}
          {characters.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-subheading text-white mb-4">Characters</h3>
              <div className="space-y-3">
                {characters.map((character) => (
                  <div
                    key={character.id}
                    className="p-3 glass-card rounded-lg hover:soft-glow smooth-transition cursor-pointer"
                  >
                    <div className="text-sm font-medium text-white mb-1">
                      {character.name}
                    </div>
                    <div className="text-xs text-white/60">
                      {character.species} • {character.profession}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Image Prompt */}
          {scene.ai_image_prompt && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-subheading text-white mb-4">AI Image Prompt</h3>
              <p className="text-body text-white/80">
                {scene.ai_image_prompt}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Scene Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Scene"
      >
        <div className="text-center py-8">
          <p className="text-white/60">Scene editing form coming soon...</p>
        </div>
      </Modal>
    </motion.div>
  );
};

export default SceneDetail; 