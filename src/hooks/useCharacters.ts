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
      
      // Only fetch characters from user's worlds
      const { data, error } = await supabase
        .from('characters')
        .select(`
          character_id, 
          world_id, 
          name, 
          origin_story, 
          traits, 
          created_at, 
          updated_at,
          worlds!inner(user_id)
        `)
        .eq('worlds.user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map database fields to UI fields
      const mappedCharacters = (data || []).map(character => ({
        id: character.character_id,
        name: character.name,
        aliases: [],
        gender: '',
        birth_date: '',
        age: 0,
        origin: '',
        current_location: '',
        species: '',
        race: '',
        caste_or_class: '',
        religion: '',
        languages: [],
        physical_appearance: {
          height: '',
          eye_color: '',
          hair_color: '',
          build: '',
          distinguishing_marks: []
        },
        personality: {
          traits: [],
          strengths: [],
          weaknesses: [],
          flaws: [],
          fears: []
        },
        skills_and_abilities: [],
        profession: '',
        affiliations: [],
        relationships: [],
        notable_events: [],
        arc_summary: '',
        status: 'Alive' as const,
        world_id: character.world_id,
        created_by: user?.id || '',
        created_at: character.created_at,
        updated_at: character.updated_at
      }));
      
      setCharacters(mappedCharacters);
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
          world_id: characterData.world_id,
          name: characterData.name,
          origin_story: {
            origin: characterData.origin,
            birth_date: characterData.birth_date,
            age: characterData.age,
            species: characterData.species,
            race: characterData.race,
            caste_or_class: characterData.caste_or_class,
            religion: characterData.religion,
            current_location: characterData.current_location,
            arc_summary: characterData.arc_summary
          },
          traits: {
            aliases: characterData.aliases,
            gender: characterData.gender,
            languages: characterData.languages,
            physical_appearance: characterData.physical_appearance,
            personality: characterData.personality,
            skills_and_abilities: characterData.skills_and_abilities,
            profession: characterData.profession,
            affiliations: characterData.affiliations,
            relationships: characterData.relationships,
            notable_events: characterData.notable_events,
            status: characterData.status
          },
          knowledge_base: []
        }])
        .select('character_id, world_id, name, origin_story, traits, knowledge_base, created_at, updated_at')
        .single();

      if (error) throw error;
      
      const mappedCharacter = {
        id: data.character_id,
        name: data.name,
        aliases: data.traits?.aliases || [],
        gender: data.traits?.gender || '',
        birth_date: data.origin_story?.birth_date || '',
        age: data.origin_story?.age || 0,
        origin: data.origin_story?.origin || '',
        current_location: data.origin_story?.current_location || '',
        species: data.origin_story?.species || '',
        race: data.origin_story?.race || '',
        caste_or_class: data.origin_story?.caste_or_class || '',
        religion: data.origin_story?.religion || '',
        languages: data.traits?.languages || [],
        physical_appearance: data.traits?.physical_appearance || {
          height: '',
          eye_color: '',
          hair_color: '',
          build: '',
          distinguishing_marks: []
        },
        personality: data.traits?.personality || {
          traits: [],
          strengths: [],
          weaknesses: [],
          flaws: [],
          fears: []
        },
        skills_and_abilities: data.traits?.skills_and_abilities || [],
        profession: data.traits?.profession || '',
        affiliations: data.traits?.affiliations || [],
        relationships: data.traits?.relationships || [],
        notable_events: data.traits?.notable_events || [],
        arc_summary: data.origin_story?.arc_summary || '',
        status: data.traits?.status || 'Alive',
        world_id: data.world_id,
        created_by: user?.id || '',
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setCharacters(prev => [mappedCharacter, ...prev]);
      toast.success('Character created successfully! 👤');
      return mappedCharacter;
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

      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.world_id !== undefined) updateData.world_id = updates.world_id;
      
      if (updates.origin || updates.birth_date || updates.age || updates.species || updates.race || 
          updates.caste_or_class || updates.religion || updates.current_location || updates.arc_summary) {
        updateData.origin_story = {
          origin: updates.origin,
          birth_date: updates.birth_date,
          age: updates.age,
          species: updates.species,
          race: updates.race,
          caste_or_class: updates.caste_or_class,
          religion: updates.religion,
          current_location: updates.current_location,
          arc_summary: updates.arc_summary
        };
      }
      
      if (updates.aliases || updates.gender || updates.languages || updates.physical_appearance || 
          updates.personality || updates.skills_and_abilities || updates.profession || 
          updates.affiliations || updates.relationships || updates.notable_events || updates.status) {
        updateData.traits = {
          aliases: updates.aliases,
          gender: updates.gender,
          languages: updates.languages,
          physical_appearance: updates.physical_appearance,
          personality: updates.personality,
          skills_and_abilities: updates.skills_and_abilities,
          profession: updates.profession,
          affiliations: updates.affiliations,
          relationships: updates.relationships,
          notable_events: updates.notable_events,
          status: updates.status
        };
      }

      const { data, error } = await supabase
        .from('characters')
        .update(updateData)
        .eq('character_id', id)
        .select('character_id, world_id, name, origin_story, traits, knowledge_base, created_at, updated_at')
        .single();

      if (error) throw error;
      
      const mappedCharacter = {
        id: data.character_id,
        name: data.name,
        aliases: data.traits?.aliases || [],
        gender: data.traits?.gender || '',
        birth_date: data.origin_story?.birth_date || '',
        age: data.origin_story?.age || 0,
        origin: data.origin_story?.origin || '',
        current_location: data.origin_story?.current_location || '',
        species: data.origin_story?.species || '',
        race: data.origin_story?.race || '',
        caste_or_class: data.origin_story?.caste_or_class || '',
        religion: data.origin_story?.religion || '',
        languages: data.traits?.languages || [],
        physical_appearance: data.traits?.physical_appearance || {
          height: '',
          eye_color: '',
          hair_color: '',
          build: '',
          distinguishing_marks: []
        },
        personality: data.traits?.personality || {
          traits: [],
          strengths: [],
          weaknesses: [],
          flaws: [],
          fears: []
        },
        skills_and_abilities: data.traits?.skills_and_abilities || [],
        profession: data.traits?.profession || '',
        affiliations: data.traits?.affiliations || [],
        relationships: data.traits?.relationships || [],
        notable_events: data.traits?.notable_events || [],
        arc_summary: data.origin_story?.arc_summary || '',
        status: data.traits?.status || 'Alive',
        world_id: data.world_id,
        created_by: user?.id || '',
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setCharacters(prev => prev.map(character => 
        character.id === id ? mappedCharacter : character
      ));
      toast.success('Character updated successfully! ✨');
      return mappedCharacter;
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
        .eq('character_id', id);

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
