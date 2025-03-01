import React, { useState, useEffect, ReactNode } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signInWithProvider } from '../../utils/supabaseClient';
import supabase from '../../utils/supabaseClient';
import dynamic from 'next/dynamic';

// Import AuthStatusIndicator with no SSR to prevent server rendering issues
const AuthStatusIndicator = dynamic(
  () => import('../../components/auth/AuthStatusIndicator'),
  { ssr: false }
);

// Social login buttons component
const SocialLoginButtons: FC = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  const handleSocialLogin = async (provider: 'discord' | 'github' | 'gitlab' | 'google') => {
    setIsLoading(provider);
    try {
      const { error } = await signInWithProvider(provider);
      if (error) {
        console.error(`${provider} login error:`, error);
        // Error will be handled in the callback page
      }
    } catch (err) {
      console.error(`Error during ${provider} sign in:`, err);
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="relative flex items-center justify-center">
        <hr className="w-full border-t border-cosmic-grey dark:border-stardust border-opacity-30 dark:border-opacity-30" />
        <span className="absolute bg-white dark:bg-midnight-blue px-2 text-sm text-cosmic-grey dark:text-stardust">
          Or continue with
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <button 
          type="button"
          onClick={() => handleSocialLogin('github')}
          disabled={!!isLoading}
          className={`flex items-center justify-center px-4 py-2 border border-cosmic-grey dark:border-stardust border-opacity-30 dark:border-opacity-30 rounded-md shadow-sm text-sm font-medium text-midnight-blue dark:text-cosmic-latte hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isLoading === 'github' ? 'opacity-70 cursor-wait' : ''}`}
        >
          {isLoading === 'github' ? (
            <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : (
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          )}
          GitHub
        </button>
        
        <button 
          type="button"
          onClick={() => handleSocialLogin('google')}
          disabled={!!isLoading}
          className={`flex items-center justify-center px-4 py-2 border border-cosmic-grey dark:border-stardust border-opacity-30 dark:border-opacity-30 rounded-md shadow-sm text-sm font-medium text-midnight-blue dark:text-cosmic-latte hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isLoading === 'google' ? 'opacity-70 cursor-wait' : ''}`}
        >
          {isLoading === 'google' ? (
            <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : (
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#4285F4"/>
              <path d="M6.52 10.92v-3.28h12.96c.24 1.84.853 3.187 1.787 4.133 1.147 1.147 2.933 2.4 6.053 2.4 4.827 0 8.6-3.893 8.6-8.72s-3.773-8.72-8.6-8.72c-2.6 0-4.507 1.027-5.907 2.347L18.107 1.44C20.053.107 22.667 0 25.32 0 31.933 0 37.493 5.387 37.493 12c0 6.613-5.56 12-12.173 12-3.573 0-6.267-1.173-8.373-3.36-2.16-2.16-2.84-5.213-2.84-7.667 0-.76.053-1.467.173-2.053H24.32" fill="#34A853"/>
              <path d="M17.707 19.08L14.48 15.6 20.213 11.52l3.227 3.48-5.733 4.08z" fill="#FBBC05"/>
              <path d="M16.133 11.52L24.32 3.333l3.227 3.48-8.187 8.187-3.227-3.48z" fill="#EA4335"/>
            </svg>
          )}
          Google
        </button>
        
        <button
          type="button"
          onClick={() => handleSocialLogin('discord')}
          disabled={!!isLoading}
          className={`flex items-center justify-center px-4 py-2 border border-cosmic-grey dark:border-stardust border-opacity-30 dark:border-opacity-30 rounded-md shadow-sm text-sm font-medium text-midnight-blue dark:text-cosmic-latte hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isLoading === 'discord' ? 'opacity-70 cursor-wait' : ''}`}
        >
          {isLoading === 'discord' ? (
            <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : (
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"/>
            </svg>
          )}
          Discord
        </button>
        
        <button
          type="button"
          onClick={() => handleSocialLogin('gitlab')}
          disabled={!!isLoading}
          className={`flex items-center justify-center px-4 py-2 border border-cosmic-grey dark:border-stardust border-opacity-30 dark:border-opacity-30 rounded-md shadow-sm text-sm font-medium text-midnight-blue dark:text-cosmic-latte hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isLoading === 'gitlab' ? 'opacity-70 cursor-wait' : ''}`}
        >
          {isLoading === 'gitlab' ? (
            <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : (
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/>
            </svg>
          )}
          GitLab
        </button>
      </div>
    </div>
  );
};

// IMMEDIATE DASHBOARD REDIRECT
// This component now automatically redirects to the dashboard without any authentication
const SignInPage: FC = () => {
  const router = useRouter();
  
  // Automatically redirect to dashboard on page load
  useEffect(() => {
    console.log('Sign-in page loaded - redirecting directly to dashboard');
    router.replace('/dashboard');
  }, [router]);
  
  // Return a minimal loading indicator while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-midnight-blue">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-electric-indigo border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg">Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default SignInPage; 