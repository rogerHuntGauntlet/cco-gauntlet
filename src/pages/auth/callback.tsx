import { useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../utils/supabaseClient';
import Head from 'next/head';

// This component handles the callback from OAuth providers
export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Process the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get the auth confirmation from Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error in auth callback:', error);
          router.push('/landing/signin?error=authcallback');
          return;
        }
        
        if (data.session) {
          // Successfully signed in, redirect to dashboard
          router.push('/dashboard');
        } else {
          // No session, redirect back to sign in
          router.push('/landing/signin');
        }
      } catch (err) {
        console.error('Exception in auth callback:', err);
        router.push('/landing/signin?error=callbackexception');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-midnight-blue">
      <Head>
        <title>Authenticating... - CCO</title>
      </Head>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-indigo"></div>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Completing authentication...</p>
      </div>
    </div>
  );
} 