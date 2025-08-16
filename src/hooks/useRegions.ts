import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Region } from '../types';
import toast from 'react-hot-toast';

export const useRegions = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRegions = async () => {
    try {
      if (!supabase) {
        setRegions([]);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setRegions(data || []);
    } catch (error) {
      console.error('Error fetching regions:', error);
      toast.error('Failed to load regions');
    } finally {
      setLoading(false);
    }
  };

  const createRegion = async (regionData: Omit<Region, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { data, error } = await supabase
        .from('regions')
        .insert([{
          ...regionData,
          created_by: user?.id,
          language: regionData.language || [],
          notable_inhabitants: regionData.notable_inhabitants || [],
          important_events: regionData.important_events || [],
          resources: regionData.resources || []
        }])
        .select()
        .single();

      if (error) throw error;
      
      setRegions(prev => [data, ...prev]);
      toast.success('Region created successfully! 🗺️');
      return data;
    } catch (error) {
      console.error('Error creating region:', error);
      toast.error('Failed to create region');
      throw error;
    }
  };

  const updateRegion = async (id: string, updates: Partial<Region>) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { data, error } = await supabase
        .from('regions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setRegions(prev => prev.map(region => 
        region.id === id ? data : region
      ));
      toast.success('Region updated successfully! ✨');
      return data;
    } catch (error) {
      console.error('Error updating region:', error);
      toast.error('Failed to update region');
      throw error;
    }
  };

  const deleteRegion = async (id: string) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { error } = await supabase
        .from('regions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setRegions(prev => prev.filter(region => region.id !== id));
      toast.success('Region deleted successfully! 🗑️');
    } catch (error) {
      console.error('Error deleting region:', error);
      toast.error('Failed to delete region');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchRegions();
    }
  }, [user]);

  return {
    regions,
    loading,
    createRegion,
    updateRegion,
    deleteRegion,
    refetch: fetchRegions
  };
};
