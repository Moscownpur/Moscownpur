import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import toast from 'react-hot-toast';

export interface UserStatistics {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  is_admin: boolean;
}


export const useAdminData = () => {
  const [users, setUsers] = useState<UserStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const { admin } = useAdminAuth();

  const fetchUsers = async () => {
    try {
      if (!supabase) {
        setUsers([]);
        return;
      }

      // Get user profiles from profiles table (this should work with RLS policies for admins)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast.error('Failed to load users');
        setUsers([]);
        return;
      }

      console.log(`Found ${profiles?.length || 0} profiles`);

      // Get user roles to determine admin status
      let { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, is_admin');

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        // Continue without roles - we'll handle this gracefully
      }

      console.log(`Found ${userRoles?.length || 0} user roles`);

      // Ensure all users have user_roles entries
      const usersWithoutRoles = profiles.filter(profile => 
        !userRoles?.find(role => role.user_id === profile.id)
      );

      if (usersWithoutRoles.length > 0) {
        console.log(`Found ${usersWithoutRoles.length} users without roles, creating default roles...`);
        
        // Create default user roles for users who don't have them
        const defaultRoles = usersWithoutRoles.map(user => ({
          user_id: user.id,
          is_admin: false
        }));

        // Try to insert default roles, but don't fail if we can't (RLS might prevent it)
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert(defaultRoles);

        if (insertError) {
          console.warn('Could not create default roles (RLS policy may prevent it):', insertError);
          // This is expected if the current user is not an admin
        } else {
          console.log(`Created ${defaultRoles.length} default user roles`);
          // Refresh user roles after creating defaults
          const { data: updatedRoles } = await supabase
            .from('user_roles')
            .select('user_id, is_admin');
          if (updatedRoles) {
            userRoles = updatedRoles;
          }
        }
      }

      // Create user statistics from profiles
      const userStats: UserStatistics[] = profiles.map(profile => {
        const role = userRoles?.find(r => r.user_id === profile.id);

        return {
          id: profile.id,
          email: profile.email || 'No email',
          full_name: profile.full_name,
          created_at: profile.created_at,
          is_admin: role?.is_admin || false
        };
      });

      console.log(`Fetched ${userStats.length} users from database`);
      console.log('User data:', userStats);
      setUsers(userStats);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setUsers([]);
    }
  };


  const toggleUserStatus = async (userId: string, makeAdmin: boolean) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      console.log(`Toggling user ${userId} to ${makeAdmin ? 'admin' : 'user'}`);

      // First, let's check the current state
      const { data: currentRole, error: currentError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();

      console.log('Current role:', currentRole, 'Error:', currentError);

      // Use upsert to handle both insert and update cases
      const { data, error } = await supabase
        .from('user_roles')
        .upsert(
          { 
            user_id: userId, 
            is_admin: makeAdmin 
          },
          {
            onConflict: 'user_id'
          }
        )
        .select();

      if (error) {
        console.error('Error in upsert:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Upsert result:', data);
      
      await fetchUsers(); // Refresh data
      toast.success(`User ${makeAdmin ? 'promoted to admin' : 'removed from admin'} successfully!`);
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error(`Failed to ${makeAdmin ? 'promote' : 'remove'} user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };


  useEffect(() => {
    if (admin) {
      fetchUsers().finally(() => {
        setLoading(false);
      });
    }
  }, [admin]);

  return {
    users,
    loading,
    toggleUserStatus,
    refetch: () => fetchUsers()
  };
};