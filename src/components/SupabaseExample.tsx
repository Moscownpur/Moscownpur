import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface World {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

function SupabaseExample() {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getWorlds() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('worlds')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setWorlds(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching worlds:', err);
      } finally {
        setLoading(false);
      }
    }

    getWorlds();
  }, []);

  if (loading) {
    return <div className="text-white">Loading worlds...</div>;
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Your Worlds</h2>
      {worlds.length === 0 ? (
        <p className="text-white/70">No worlds found. Create your first world!</p>
      ) : (
        <div className="grid gap-4">
          {worlds.map((world) => (
            <div key={world.id} className="glass-card p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white">{world.name}</h3>
              <p className="text-white/70 mt-2">{world.description}</p>
              <p className="text-white/50 text-sm mt-2">
                Created: {new Date(world.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SupabaseExample;
