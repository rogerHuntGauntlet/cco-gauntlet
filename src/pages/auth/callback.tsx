import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../utils/supabaseClient';
import Head from 'next/head';

// This component handles the callback from OAuth providers
export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Process the OAuth callback
    const handleAuthCallback = async () => {
      try {
        console.log('Processing auth callback');
        
        // Get the hash from the URL if it exists
        const hashParams = window.location.hash;
        if (hashParams) {
          console.log('Hash params found in URL, parsing...');
        }
        
        // First try to exchange the auth code for a session
        // This is important as some OAuth providers return via hash fragment
        await supabase.auth.getSession();
        
        // Get the auth confirmation from Supabase
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
          console.log('Session obtained successfully, redirecting to dashboard...');
          
          // Ensure cookies are properly set
          try {
            // Force a session refresh to ensure all cookies are properly set
            await supabase.auth.refreshSession();
            
            // Successfully signed in, redirect to dashboard
            router.push('/dashboard');
          } catch (refreshError) {
            console.error('Error refreshing session:', refreshError);
            
            // Try direct navigation as a fallback
            window.location.href = '/dashboard';
          }
        } else {
          console.warn('No session returned from Supabase, redirecting to signin...');
          // No session, redirect back to sign in
          router.push('/landing/signin?error=nosession');
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
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Completing authentication...</p>
          </>
        )}
      </div>
    </div>
  );
} 