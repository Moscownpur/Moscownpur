import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const TokenHelper: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const getToken = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setToken(session.access_token);
        setUser(session.user);
        console.log('Access Token:', session.access_token);
        console.log('User:', session.user);
      } else {
        console.log('No active session - please login first');
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
  };

  const testAPI = async () => {
    if (!token) {
      alert('Please get token first');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/user/dashboard-data', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log('API Response:', data);
      alert(`API Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('API Test Error:', error);
      alert('API Test Failed: ' + error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">🔐 Token Helper (Remove after testing)</h3>
      
      <div className="space-y-2">
        <button 
          onClick={getToken}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Get Access Token
        </button>
        
        {token && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Token (first 50 chars): {token.substring(0, 50)}...</p>
            <p className="text-sm text-gray-600">User: {user?.email}</p>
            
            <button 
              onClick={testAPI}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-2"
            >
              Test API
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenHelper;