import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabaseClient';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * A simple component to display the current authentication and Supabase connection status
 * Useful for debugging authentication issues
 */
const AuthStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<{
    connected: boolean;
    authenticated: boolean;
    message: string;
    details?: any;
  }>({
    connected: false,
    authenticated: false,
    message: 'Checking connection...',
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      // First check if we can connect to Supabase at all
      let connectionSuccess = false;
      try {
        // Try to ping the Supabase service (this is a lightweight operation)
        const { data, error } = await supabase.from('_test_connection').select('count');
        connectionSuccess = !error;
      } catch (e) {
        console.error('Supabase connection test failed:', e);
      }

      // Then check authentication
      const { data: sessionData } = await supabase.auth.getSession();
      const isAuthenticated = !!sessionData.session;
      
      // Get environment info
      const envInfo = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL 
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20)}...` 
          : 'Not configured',
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        environment: process.env.NODE_ENV || 'unknown',
      };

      setStatus({
        connected: connectionSuccess,
        authenticated: isAuthenticated,
        message: getStatusMessage(connectionSuccess, isAuthenticated),
        details: {
          sessionExists: isAuthenticated,
          userId: sessionData.session?.user?.id || 'none',
          connectionTested: true,
          timestamp: new Date().toISOString(),
          envInfo,
        }
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      setStatus({
        connected: false,
        authenticated: false,
        message: 'Error checking status',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusMessage = (connected: boolean, authenticated: boolean): string => {
    if (!connected) return 'Cannot connect to Supabase';
    if (authenticated) return 'Connected and authenticated';
    return 'Connected but not authenticated';
  };

  const getStatusColor = (): string => {
    if (isLoading) return 'bg-gray-300 dark:bg-gray-600';
    if (!status.connected) return 'bg-red-500';
    if (status.authenticated) return 'bg-green-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="text-sm">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-700 dark:text-gray-300 hover:underline flex items-center"
        >
          {status.message}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`ml-1 h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button 
          onClick={checkStatus}
          disabled={isLoading}
          className={`text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Checking...' : 'Refresh'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-2 p-3 rounded-md bg-gray-100 dark:bg-gray-800 max-w-lg text-xs overflow-auto">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(status.details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AuthStatusIndicator; 