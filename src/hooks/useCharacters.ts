import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Character } from '../types';
import toast from 'react-hot-toast';

export const useCharacters = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCharacters = async () => {
    try {
      if (!supabase) {
        setCharacters([]);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCharacters(data || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
      toast.error('Failed to load characters');
    } finally {
      setLoading(false);
    }
  };

  const createCharacter = async (characterData: Omit<Character, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { data, error } = await supabase
        .from('characters')
        .insert([{
          ...characterData,
          created_by: user?.id,
          aliases: characterData.aliases || [],
          languages: characterData.languages || [],
          skills_and_abilities: characterData.skills_and_abilities || [],
          affiliations: characterData.affiliations || [],
          relationships: characterData.relationships || [],
          notable_events: characterData.notable_events || [],
          physical_appearance: characterData.physical_appearance || {
            height: '',
            eye_color: '',
            hair_color: '',
            build: '',
            distinguishing_marks: []
          },
          personality: characterData.personality || {
            traits: [],
            strengths: [],
            weaknesses: [],
            flaws: [],
            fears: []
          }
        }])
        .select()
        .single();

      if (error) throw error;
      
      setCharacters(prev => [data, ...prev]);
      toast.success('Character created successfully! 👤');
      return data;
    } catch (error) {
      console.error('Error creating character:', error);
      toast.error('Failed to create character');
      throw error;
    }
  };

  const updateCharacter = async (id: string, updates: Partial<Character>) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { data, error } = await supabase
        .from('characters')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCharacters(prev => prev.map(character => 
        character.id === id ? data : character
      ));
      toast.success('Character updated successfully! ✨');
      return data;
    } catch (error) {
      console.error('Error updating character:', error);
      toast.error('Failed to update character');
      throw error;
    }
  };

  const deleteCharacter = async (id: string) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCharacters(prev => prev.filter(character => character.id !== id));
      toast.success('Character deleted successfully! 🗑️');
    } catch (error) {
      console.error('Error deleting character:', error);
      toast.error('Failed to delete character');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchCharacters();
    }
  }, [user]);

  return {
    characters,
    loading,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    refetch: fetchCharacters
  };
};
