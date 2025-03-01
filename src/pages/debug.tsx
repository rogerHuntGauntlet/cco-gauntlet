import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import supabase, { signIn, signUp, getUser } from '../utils/supabaseClient';

const DebugPage = () => {
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('password123');
  const [logs, setLogs] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };
  
  useEffect(() => {
    // Check current session on load
    const checkSession = async () => {
      try {
        addLog('Checking current session...');
        const { user, error } = await getUser();
        
        if (error) {
          addLog(`Session check error: ${error.message}`);
        } else if (user) {
          addLog(`Session found for user: ${user.id}`);
          setCurrentUser(user);
        } else {
          addLog('No active session found');
        }
      } catch (err) {
        addLog(`Unexpected error checking session: ${err}`);
      }
    };
    
    checkSession();
  }, []);
  
  const handleTestSignIn = async () => {
    try {
      addLog(`Testing sign in with ${testEmail}...`);
      const { data, error } = await signIn(testEmail, testPassword);
      
      if (error) {
        addLog(`Sign in error: ${error.message}`);
        console.error('Sign in error details:', error);
      } else if (data?.user) {
        addLog(`Sign in successful for user: ${data.user.id}`);
        setCurrentUser(data.user);
      } else {
        addLog('Sign in returned no error but no user data');
      }
    } catch (err) {
      addLog(`Unexpected error during sign in: ${err}`);
    }
  };
  
  const handleTestSignUp = async () => {
    try {
      addLog(`Testing sign up with ${testEmail}...`);
      const { data, error } = await signUp(testEmail, testPassword);
      
      if (error) {
        addLog(`Sign up error: ${error.message}`);
        console.error('Sign up error details:', error);
      } else if (data) {
        addLog(`Sign up result: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      addLog(`Unexpected error during sign up: ${err}`);
    }
  };
  
  const handleSignOut = async () => {
    try {
      addLog('Testing sign out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        addLog(`Sign out error: ${error.message}`);
      } else {
        addLog('Sign out successful');
        setCurrentUser(null);
      }
    } catch (err) {
      addLog(`Unexpected error during sign out: ${err}`);
    }
  };
  
  const handleCheckConnection = async () => {
    try {
      addLog('Testing Supabase connection...');
      const response = await fetch('/api/test-supabase');
      const result = await response.json();
      
      addLog(`Connection test result: ${JSON.stringify(result)}`);
    } catch (err) {
      addLog(`Connection test error: ${err}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Head>
        <title>Supabase Debug Page</title>
      </Head>
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Supabase Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Test Authentication</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input 
                  type="password" 
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={handleTestSignIn}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Test Sign In
              </button>
              
              <button
                onClick={handleTestSignUp}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Test Sign Up
              </button>
              
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Test Sign Out
              </button>
              
              <button
                onClick={handleCheckConnection}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Test Connection
              </button>
            </div>
            
            {currentUser && (
              <div className="p-4 bg-green-50 border border-green-200 rounded mb-6">
                <h3 className="font-medium text-green-800 mb-2">Current User</h3>
                <pre className="text-sm bg-white p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(currentUser, null, 2)}
                </pre>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
            <div className="bg-gray-900 text-gray-100 p-4 rounded h-96 overflow-y-auto font-mono text-sm">
              {logs.map((log, i) => (
                <div key={i} className="mb-1">{log}</div>
              ))}
              {logs.length === 0 && (
                <div className="text-gray-500">No logs yet...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage; 