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
        .from('dialogues')
        .select(`
          dialogue_id,
          scene_id,
          character_id,
          content,
          delivery_type,
          sequence,
          sentiment_score,
          created_at,
          updated_at,
          characters:character_id(name)
        `)
        .eq('scene_id', sceneId)
        .order('sequence', { ascending: true });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedLines: SceneLineWithCharacter[] = (data || []).map(line => ({
        id: line.dialogue_id,
        scene_id: line.scene_id,
        type: line.character_id ? 'character' : 'narration',
        character_id: line.character_id,
        display_name: line.characters?.name || 'Narrator',
        text: line.content,
        order_index: line.sequence,
        created_by: user?.id || '',
        created_at: line.created_at,
        updated_at: line.updated_at,
        character_name: line.characters?.name,
        character_role: line.character_id ? 'participant' : 'narrator'
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
        .from('dialogues')
        .insert([{
          scene_id: sceneId,
          character_id: lineData.character_id,
          content: lineData.text,
          delivery_type: lineData.type === 'character' ? 'speech_bubble' : 'narration',
          sequence: lineData.order_index || lines.length + 1,
          sentiment_score: null
        }])
        .select(`
          dialogue_id,
          scene_id,
          character_id,
          content,
          delivery_type,
          sequence,
          sentiment_score,
          created_at,
          updated_at,
          characters:character_id(name)
        `)
        .single();

      if (error) throw error;
      
      const newLine: SceneLineWithCharacter = {
        id: data.dialogue_id,
        scene_id: data.scene_id,
        type: data.character_id ? 'character' : 'narration',
        character_id: data.character_id,
        display_name: data.characters?.name || 'Narrator',
        text: data.content,
        order_index: data.sequence,
        created_by: user?.id || '',
        created_at: data.created_at,
        updated_at: data.updated_at,
        character_name: data.characters?.name,
        character_role: data.character_id ? 'participant' : 'narrator'
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

      const updateData: any = {};
      if (updates.text !== undefined) updateData.content = updates.text;
      if (updates.order_index !== undefined) updateData.sequence = updates.order_index;
      if (updates.character_id !== undefined) updateData.character_id = updates.character_id;

      const { data, error } = await supabase
        .from('dialogues')
        .update(updateData)
        .eq('dialogue_id', id)
        .select(`
          dialogue_id,
          scene_id,
          character_id,
          content,
          delivery_type,
          sequence,
          sentiment_score,
          created_at,
          updated_at,
          characters:character_id(name)
        `)
        .single();

      if (error) throw error;
      
      const updatedLine: SceneLineWithCharacter = {
        id: data.dialogue_id,
        scene_id: data.scene_id,
        type: data.character_id ? 'character' : 'narration',
        character_id: data.character_id,
        display_name: data.characters?.name || 'Narrator',
        text: data.content,
        order_index: data.sequence,
        created_by: user?.id || '',
        created_at: data.created_at,
        updated_at: data.updated_at,
        character_name: data.characters?.name,
        character_role: data.character_id ? 'participant' : 'narrator'
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
        .from('dialogues')
        .delete()
        .eq('dialogue_id', id);

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

      // Update sequence for each line
      const updates = newOrder.map((line, index) => ({
        dialogue_id: line.id,
        sequence: index + 1
      }));

      // Batch update all lines
      const { error } = await supabase
        .from('dialogues')
        .upsert(updates, { onConflict: 'dialogue_id' });

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