import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { SceneLine, SceneLineWithCharacter } from '../types';
import toast from 'react-hot-toast';

export const useSceneLines = (sceneId: string) => {
  const [lines, setLines] = useState<SceneLineWithCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchLines = async () => {
    try {
      if (!supabase) {
        setLines([]);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('scene_lines')
        .select(`
          *,
          characters:character_id(name),
          scene_characters(role_in_scene)
        `)
        .eq('scene_id', sceneId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedLines: SceneLineWithCharacter[] = (data || []).map(line => ({
        ...line,
        character_name: line.characters?.name,
        character_role: line.scene_characters?.[0]?.role_in_scene
      }));
      
      setLines(transformedLines);
    } catch (error) {
      console.error('Error fetching scene lines:', error);
      toast.error('Failed to load scene dialogue');
    } finally {
      setLoading(false);
    }
  };

  const addLine = async (lineData: Omit<SceneLine, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { data, error } = await supabase
        .from('scene_lines')
        .insert([{
          ...lineData,
          scene_id: sceneId,
          created_by: user?.id,
          order_index: lineData.order_index || lines.length + 1
        }])
        .select(`
          *,
          characters:character_id(name),
          scene_characters(role_in_scene)
        `)
        .single();

      if (error) throw error;
      
      const newLine: SceneLineWithCharacter = {
        ...data,
        character_name: data.characters?.name,
        character_role: data.scene_characters?.[0]?.role_in_scene
      };
      
      setLines(prev => [...prev, newLine]);
      toast.success('Dialogue line added! ✨');
      return newLine;
    } catch (error) {
      console.error('Error adding scene line:', error);
      toast.error('Failed to add dialogue line');
      throw error;
    }
  };

  const updateLine = async (id: string, updates: Partial<SceneLine>) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { data, error } = await supabase
        .from('scene_lines')
        .update(updates)
        .eq('id', id)
        .eq('created_by', user?.id)
        .select(`
          *,
          characters:character_id(name),
          scene_characters(role_in_scene)
        `)
        .single();

      if (error) throw error;
      
      const updatedLine: SceneLineWithCharacter = {
        ...data,
        character_name: data.characters?.name,
        character_role: data.scene_characters?.[0]?.role_in_scene
      };
      
      setLines(prev => prev.map(line => line.id === id ? updatedLine : line));
      toast.success('Dialogue updated! 🌟');
      return updatedLine;
    } catch (error) {
      console.error('Error updating scene line:', error);
      toast.error('Failed to update dialogue');
      throw error;
    }
  };

  const deleteLine = async (id: string) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { error } = await supabase
        .from('scene_lines')
        .delete()
        .eq('id', id)
        .eq('created_by', user?.id);

      if (error) throw error;
      
      setLines(prev => prev.filter(line => line.id !== id));
      toast.success('Dialogue line removed 🗑️');
    } catch (error) {
      console.error('Error deleting scene line:', error);
      toast.error('Failed to remove dialogue line');
      throw error;
    }
  };

  const reorderLines = async (newOrder: SceneLineWithCharacter[]) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      // Update order_index for each line
      const updates = newOrder.map((line, index) => ({
        id: line.id,
        order_index: index + 1
      }));

      // Batch update all lines
      const { error } = await supabase
        .from('scene_lines')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;
      
      setLines(newOrder);
      toast.success('Dialogue order updated! 📝');
    } catch (error) {
      console.error('Error reordering scene lines:', error);
      toast.error('Failed to reorder dialogue');
      throw error;
    }
  };

  const addCharacterLine = async (characterId: string, text: string) => {
    const character = lines.find(line => line.character_id === characterId);
    const displayName = character?.display_name || 'Unknown Character';
    
    return addLine({
      scene_id: sceneId,
      type: 'character',
      character_id: characterId,
      display_name: displayName,
      text,
      order_index: lines.length + 1,
      created_by: user?.id || ''
    });
  };

  const addNarrationLine = async (text: string, displayName: string = 'Narrator') => {
    return addLine({
      scene_id: sceneId,
      type: 'narration',
      character_id: null,
      display_name: displayName,
      text,
      order_index: lines.length + 1,
      created_by: user?.id || ''
    });
  };

  useEffect(() => {
    if (sceneId && user) {
      fetchLines();
    }
  }, [sceneId, user]);

  return {
    lines,
    loading,
    addLine,
    updateLine,
    deleteLine,
    reorderLines,
    addCharacterLine,
    addNarrationLine,
    refetch: fetchLines
  };
}; 