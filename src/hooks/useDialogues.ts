import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Dialogue, DialogueCreate, DialogueUpdate, DialogueFilters } from '../types/dialogue';

export const useDialogues = (sceneId: string) => {
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dialogues for a scene
  const fetchDialogues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('dialogues')
        .select('*')
        .eq('scene_id', sceneId)
        .order('sequence', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setDialogues(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dialogues');
      console.error('Error fetching dialogues:', err);
    } finally {
      setLoading(false);
    }
  }, [sceneId]);

  // Add new dialogue
  const addDialogue = useCallback(async (dialogueData: DialogueCreate): Promise<Dialogue | null> => {
    try {
      setError(null);

      const { data, error: insertError } = await supabase
        .from('dialogues')
        .insert([dialogueData])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      if (data) {
        setDialogues(prev => [...prev, data]);
        return data;
      }

      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add dialogue');
      console.error('Error adding dialogue:', err);
      return null;
    }
  }, []);

  // Update existing dialogue
  const updateDialogue = useCallback(async (dialogueId: string, updates: Partial<DialogueUpdate>): Promise<Dialogue | null> => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('dialogues')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('dialogue_id', dialogueId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      if (data) {
        setDialogues(prev => prev.map(d => d.dialogue_id === dialogueId ? data : d));
        return data;
      }

      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update dialogue');
      console.error('Error updating dialogue:', err);
      return null;
    }
  }, []);

  // Delete dialogue
  const deleteDialogue = useCallback(async (dialogueId: string): Promise<boolean> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('dialogues')
        .delete()
        .eq('dialogue_id', dialogueId);

      if (deleteError) {
        throw deleteError;
      }

      setDialogues(prev => prev.filter(d => d.dialogue_id !== dialogueId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete dialogue');
      console.error('Error deleting dialogue:', err);
      return false;
    }
  }, []);

  // Reorder dialogues
  const reorderDialogues = useCallback(async (dialogueIds: string[]): Promise<boolean> => {
    try {
      setError(null);

      // Update sequence numbers for all dialogues
      const updates = dialogueIds.map((id, index) => ({
        dialogue_id: id,
        sequence: index + 1
      }));

      const { error: updateError } = await supabase
        .from('dialogues')
        .upsert(updates, { onConflict: 'dialogue_id' });

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setDialogues(prev => {
        const newDialogues = [...prev];
        updates.forEach(({ dialogue_id, sequence }) => {
          const dialogue = newDialogues.find(d => d.dialogue_id === dialogue_id);
          if (dialogue) {
            dialogue.sequence = sequence;
          }
        });
        return newDialogues.sort((a, b) => a.sequence - b.sequence);
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder dialogues');
      console.error('Error reordering dialogues:', err);
      return false;
    }
  }, []);

  // Filter dialogues
  const filterDialogues = useCallback((filters: DialogueFilters): Dialogue[] => {
    return dialogues.filter(dialogue => {
      if (filters.delivery_type && dialogue.delivery_type !== filters.delivery_type) {
        return false;
      }
      if (filters.character_id && dialogue.character_id !== filters.character_id) {
        return false;
      }
      if (filters.sequence_min && dialogue.sequence < filters.sequence_min) {
        return false;
      }
      if (filters.sequence_max && dialogue.sequence > filters.sequence_max) {
        return false;
      }
      if (filters.sentiment_min && (dialogue.sentiment_score || 0) < filters.sentiment_min) {
        return false;
      }
      if (filters.sentiment_max && (dialogue.sentiment_score || 0) > filters.sentiment_max) {
        return false;
      }
      if (filters.created_after && dialogue.created_at < filters.created_after) {
        return false;
      }
      if (filters.created_before && dialogue.created_at > filters.created_before) {
        return false;
      }
      return true;
    });
  }, [dialogues]);

  // Get dialogue statistics
  const getDialogueStats = useCallback(() => {
    if (dialogues.length === 0) {
      return {
        total_count: 0,
        by_type: { speech_bubble: 0, narration: 0, thought: 0, song: 0 },
        by_character: {},
        average_sentiment: 0,
        sequence_range: { min: 0, max: 0 }
      };
    }

    const byType = dialogues.reduce((acc, dialogue) => {
      acc[dialogue.delivery_type] = (acc[dialogue.delivery_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCharacter = dialogues.reduce((acc, dialogue) => {
      if (dialogue.character_id) {
        acc[dialogue.character_id] = (acc[dialogue.character_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const sentimentScores = dialogues
      .map(d => d.sentiment_score)
      .filter(score => score !== undefined && score !== null) as number[];

    const averageSentiment = sentimentScores.length > 0
      ? sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length
      : 0;

    const sequences = dialogues.map(d => d.sequence);
    const sequenceRange = {
      min: Math.min(...sequences),
      max: Math.max(...sequences)
    };

    return {
      total_count: dialogues.length,
      by_type: byType,
      by_character: byCharacter,
      average_sentiment: averageSentiment,
      sequence_range: sequenceRange
    };
  }, [dialogues]);

  // Initialize on mount
  useEffect(() => {
    if (sceneId) {
      fetchDialogues();
    }
  }, [sceneId, fetchDialogues]);

  return {
    dialogues,
    loading,
    error,
    addDialogue,
    updateDialogue,
    deleteDialogue,
    reorderDialogues,
    filterDialogues,
    getDialogueStats,
    refreshDialogues: fetchDialogues
  };
};
