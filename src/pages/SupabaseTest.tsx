import React from 'react';
import SupabaseExample from '../components/SupabaseExample';

const SupabaseTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Supabase Connection Test</h1>
          <p className="text-white/70">
            Testing the connection to your Moscownpur Supabase database
          </p>
        </div>
        
        <div className="glass-card rounded-2xl p-8">
          <SupabaseExample />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm">
            If you see "No worlds found", it means the connection is working but there's no data yet.
            <br />
            If you see an error, check your .env file configuration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;
