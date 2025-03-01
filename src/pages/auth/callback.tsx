import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../utils/supabaseClient';
import Head from 'next/head';

// This component handles the callback from OAuth providers
export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('Initializing authentication...');

  useEffect(() => {
    // Process the OAuth callback
    const handleAuthCallback = async () => {
      try {
        console.log('Processing auth callback');
        setProcessingStatus('Processing authentication callback...');
        
        // Debug cookie state on entry
        console.log('Cookie state on callback entry:', document.cookie);
        
        // Get the hash from the URL if it exists
        const hashParams = window.location.hash;
        if (hashParams) {
          console.log('Hash params found in URL');
        }
        
        // Clear any previously stored auth data to avoid conflicts
        try {
          localStorage.removeItem('supabase.auth.token');
          sessionStorage.removeItem('supabase.auth.token');
          
          // Clear auth cookies
          const authCookies = ['sb-access-token', 'sb-refresh-token', 'supabase-auth-token'];
          authCookies.forEach(cookieName => {
            document.cookie = `${cookieName}=; max-age=0; path=/;`;
          });
        } catch (clearError) {
          console.warn('Error clearing previous auth data:', clearError);
        }
        
        // First try to exchange the auth code for a session
        setProcessingStatus('Establishing session...');
        console.log('Attempting to establish session with Supabase');
        
        // This will process the OAuth token or code from the URL
        // The URL is automatically processed by Supabase's auth handlers
        const { error: setupError } = await supabase.auth.getSession();
        
        if (setupError) {
          console.error('Error in initial session setup:', setupError);
          throw new Error(`Session setup failed: ${setupError.message}`);
        }
        
        // Get the auth confirmation from Supabase
        setProcessingStatus('Retrieving your user profile...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error in auth callback:', error);
          
          // Add more context to the error for debugging
          const errorContext = {
            message: error.message,
            status: error.status,
            code: 'auth_callback_error'
          };
          
          console.error('Auth callback error details:', errorContext);
          
          // Display error to user
          setError('Authentication failed. Please try again or contact support if the issue persists.');
          
          // Redirect after a short delay
          setTimeout(() => {
            router.push(`/landing/signin?error=authcallback&code=${error.status || 'unknown'}`);
          }, 3000);
          
          return;
        }
        
        if (data.session) {
          console.log('Session obtained successfully');
          
          // Debug current cookie state
          console.log('Cookie state after session retrieval:', document.cookie);
          
          // Ensure cookies are properly set
          try {
            setProcessingStatus('Finalizing your session...');
            console.log('Refreshing session to ensure cookies are set...');
            
            // Apply session to local storage as a backup mechanism
            try {
              localStorage.setItem('sb-auth-token', data.session.access_token);
            } catch (storageError) {
              console.warn('Could not store token in localStorage:', storageError);
            }
            
            // Force a session refresh to ensure all cookies are properly set
            const refreshResult = await supabase.auth.refreshSession();
            
            if (refreshResult.error) {
              console.warn('Session refresh warning:', refreshResult.error.message);
              // Continue anyway since we have a session
            } else {
              console.log('Session refresh successful');
            }
            
            // Debug cookie state after refresh
            console.log('Cookie state after refresh:', document.cookie);
            
            // Set a success status
            setProcessingStatus('Authentication successful! Redirecting to dashboard...');
            
            // Add a short delay before redirect to ensure cookies are saved
            setTimeout(() => {
              // Successfully signed in, redirect to dashboard
              router.push('/dashboard');
            }, 1000);
          } catch (refreshError) {
            console.error('Error refreshing session:', refreshError);
            
            // If refresh fails, attempt direct navigation as fallback
            setProcessingStatus('Redirecting you to the dashboard...');
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1000);
          }
        } else {
          console.warn('No session returned from Supabase, redirecting to signin...');
          setError('Unable to complete authentication. No session was created.');
          
          // No session, redirect back to sign in
          setTimeout(() => {
            router.push('/landing/signin?error=nosession');
          }, 3000);
        }
      } catch (err) {
        console.error('Exception in auth callback:', err);
        
        // Set user-visible error
        setError('An unexpected error occurred. Please try signing in again.');
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/landing/signin?error=callbackexception');
        }, 3000);
      }
    };

    // Only run once on component mount
    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-midnight-blue">
      <Head>
        <title>Authenticating... - CCO</title>
      </Head>
      <div className="text-center">
        {error ? (
          <div className="text-electric-crimson mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg">{error}</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Redirecting you back to the login page...</p>
          </div>
        ) : (
          <>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-indigo"></div>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">{processingStatus}</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please do not close this window</p>
          </>
        )}
      </div>
    </div>
  );
} 