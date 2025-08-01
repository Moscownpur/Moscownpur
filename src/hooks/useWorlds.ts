import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { World } from '../types';
import toast from 'react-hot-toast';

export const useWorlds = () => {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWorlds = async () => {
    try {
      if (!supabase) {
        // Mock data for demo mode
        const mockWorlds: World[] = [
          {
            id: '1',
            name: 'Aethermoor',
            type: 'Magical Realm',
            description: 'A mystical realm where magic flows through crystalline formations and ancient forests whisper secrets of forgotten ages.',
            creation_myth: 'Born from the tears of the first celestial being, Aethermoor was shaped by divine sorrow and hope.',
            governing_laws: {
              time: 'Linear',
              magic: 'Enabled',
              death: 'Rebirth',
              technology_level: 'Medieval with Magic'
            },
            dominant_species: ['Elves', 'Dragons', 'Fae'],
            visual_style: 'Ethereal and luminous',
            theme: 'mystical',
            created_by: user?.id || 'demo-user',
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-16T14:20:00Z'
          },
          {
            id: '2',
            name: 'Neo-Tokyo 2387',
            type: 'Timeline Variant',
            description: 'A cyberpunk metropolis where neon lights pierce through perpetual rain and corporate towers scrape the polluted sky.',
            creation_myth: 'After the Great Collapse of 2089, humanity rebuilt civilization in vertical cities powered by quantum cores.',
            governing_laws: {
              time: 'Linear',
              magic: 'Scientific',
              death: 'Permanent',
              technology_level: 'Advanced Cyberpunk'
            },
            dominant_species: ['Enhanced Humans', 'AI Constructs'],
            visual_style: 'Neon-lit cyberpunk',
            theme: 'cyberpunk',
            created_by: user?.id || 'demo-user',
            created_at: '2024-01-12T08:15:00Z',
            updated_at: '2024-01-14T16:45:00Z'
          }
        ];
        setWorlds(mockWorlds);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('worlds')
        .select('*')
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorlds(data || []);
    } catch (error) {
      console.error('Error fetching worlds:', error);
      toast.error('Failed to load worlds');
    } finally {
      setLoading(false);
    }
  };

  const createWorld = async (worldData: Omit<World, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!supabase) {
        // Mock creation for demo mode
        const mockWorld: World = {
          ...worldData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: user?.id || 'demo-user'
        };
        setWorlds(prev => [mockWorld, ...prev]);
        toast.success('World created successfully! ✨ (Demo Mode)');
        return mockWorld;
      }

      const { data, error } = await supabase
        .from('worlds')
        .insert([{
          ...worldData,
          created_by: user?.id,
          governing_laws: worldData.governing_laws,
          dominant_species: worldData.dominant_species
        }])
        .select()
        .single();

      if (error) throw error;
      
      setWorlds(prev => [data, ...prev]);
      toast.success('World created successfully! ✨');
      return data;
    } catch (error) {
      console.error('Error creating world:', error);
      toast.error('Failed to create world');
      throw error;
    }
  };

  const updateWorld = async (id: string, updates: Partial<World>) => {
    try {
      if (!supabase) {
        // Mock update for demo mode
        setWorlds(prev => prev.map(w => 
          w.id === id 
            ? { ...w, ...updates, updated_at: new Date().toISOString() }
            : w
        ));
        toast.success('World updated! 🌟 (Demo Mode)');
        return;
      }

      const { data, error } = await supabase
        .from('worlds')
        .update(updates)
        .eq('id', id)
        .eq('created_by', user?.id)
        .select()
        .single();

      if (error) throw error;
      
      setWorlds(prev => prev.map(w => w.id === id ? data : w));
      toast.success('World updated! 🌟');
      return data;
    } catch (error) {
      console.error('Error updating world:', error);
      toast.error('Failed to update world');
      throw error;
    }
  };

  const deleteWorld = async (id: string) => {
    try {
      if (!supabase) {
        // Mock deletion for demo mode
        setWorlds(prev => prev.filter(w => w.id !== id));
        toast.success('World deleted 🗑️ (Demo Mode)');
        return;
      }
      
      const { error } = await supabase
        .from('worlds')
        .delete()
        .eq('id', id)
        .eq('created_by', user?.id);

      if (error) throw error;
      
      setWorlds(prev => prev.filter(w => w.id !== id));
      toast.success('World deleted 🗑️');
    } catch (error) {
      console.error('Error deleting world:', error);
      toast.error('Failed to delete world');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchWorlds();
    }
  }, [user]);

  return {
    worlds,
    loading,
    createWorld,
    updateWorld,
    deleteWorld,
    refetch: fetchWorlds
  };
};