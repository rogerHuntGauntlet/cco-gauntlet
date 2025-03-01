import React, { useState, useEffect, ReactNode } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { signIn } from '../../utils/supabaseClient';
import dynamic from 'next/dynamic';

// Import AuthStatusIndicator with no SSR to prevent server rendering issues
const AuthStatusIndicator = dynamic(
  () => import('../../components/auth/AuthStatusIndicator'),
  { ssr: false }
);

const SignInPage: FC = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '' as string | ReactNode,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authDiagnostics, setAuthDiagnostics] = useState<any>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Check system preference on load
  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // If no saved preference, use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors, general: '' };

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
      isValid = false;
    } else {
      newErrors.email = '';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else {
      newErrors.password = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const checkAuthStatus = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/auth-status');
      const data = await response.json();
      setAuthDiagnostics(data);
      setShowDiagnostics(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error fetching auth status:', err);
      setAuthDiagnostics({ error: 'Failed to fetch auth status' });
      setShowDiagnostics(true);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, validating...');
    setShowDiagnostics(false);
    
    if (validateForm()) {
      setIsSubmitting(true);
      console.log('Form validation passed, attempting sign in...');
      
      try {
        // Use Supabase for authentication
        console.log('Credentials prepared, calling signIn function...');
        const { data, error } = await signIn(formData.email, formData.password);
        
        if (error) {
          console.error('Supabase auth error:', error);
          // Log more details about the error
          console.error('Error details:', JSON.stringify(error, null, 2));
          
          // Show a more helpful error message with debug bypass option for backend errors
          const isBackendError = error.status === 500 || 
                                error.message?.includes('unavailable') ||
                                error.message?.includes('Authentication service');
          
          setErrors(prev => ({ 
            ...prev, 
            general: (
              <>
                <div className="font-medium mb-1">Authentication Error:</div>
                <div>{error.message || 'Authentication failed. Please check your credentials or try again later.'}</div>
                
                {isBackendError && (
                  <div className="mt-3 space-y-2">
                    <div className="font-medium">Possible Solutions:</div>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Try again in a few minutes - Supabase auth might be temporarily unavailable</li>
                      <li>Check if your Supabase instance is active - free tier instances go to sleep</li>
                      <li>Verify that your email/password combination is correct</li>
                    </ol>
                    
                    <div className="mt-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <button 
                        type="button"
                        onClick={checkAuthStatus}
                        className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        Check Auth Status
                      </button>
                      
                      <Link 
                        href="/dashboard?debugBypass=true" 
                        className="text-sm text-center px-3 py-1 text-electric-indigo border border-electric-indigo rounded hover:bg-electric-indigo hover:bg-opacity-10 transition-colors"
                      >
                        Bypass Login (Dev Only)
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )
          }));
          setIsSubmitting(false);
          return;
        }
        
        if (data?.user) {
          console.log('Sign-in successful, preparing redirect...');
          // Check if there's a redirectTo query parameter
          const redirectTo = router.query.redirectTo as string;
          if (redirectTo) {
            // Decode the URL if it's URL-encoded
            const decodedRedirect = decodeURIComponent(redirectTo);
            console.log('Redirecting to:', decodedRedirect);
            router.push(decodedRedirect);
          } else {
            // Default redirect to dashboard if no redirectTo parameter
            console.log('No redirectTo parameter, defaulting to dashboard...');
            router.push('/dashboard');
          }
        } else {
          console.error('No user data returned but no error either, unusual state');
          setErrors(prev => ({ ...prev, general: 'An unexpected error occurred' }));
          setIsSubmitting(false);
        }
      } catch (err) {
        console.error('Login error:', err);
        if (err instanceof Error) {
          console.error('Error stack:', err.stack);
        }
        
        setErrors(prev => ({ 
          ...prev, 
          general: 'Server error occurred. Please try again later or contact support if the issue persists.' 
        }));
        setIsSubmitting(false);
      }
    } else {
      console.log('Form validation failed');
    }
  };

  return (
    <div className="bg-white dark:bg-midnight-blue min-h-screen flex flex-col transition-colors duration-300">
      <Head>
        <title>Sign In - CCO</title>
        <meta name="description" content="Sign in to your CCO account" />
      </Head>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left panel - Branding & Info */}
        <div className="bg-gradient-to-br from-electric-indigo to-neon-teal md:w-1/2 p-12 flex flex-col justify-between">
          <div>
            <Link href="/" className="inline-flex items-center">
              <span className="text-3xl font-bold text-white">CCO</span>
            </Link>
          </div>
          
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Welcome back!</h1>
            <p className="text-xl opacity-90 mb-8">
              Continue enhancing your creative flow with CCO.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Access your second brain</h3>
                  <p className="opacity-80">All your knowledge and insights in one place</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Join meetings with confidence</h3>
                  <p className="opacity-80">Get real-time assistance and automated documentation</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Connect with vibe coders</h3>
                  <p className="opacity-80">Expand your network and find your perfect collaborators</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-white text-sm opacity-70">
            © 2023 CCO. All rights reserved.
          </div>
        </div>
        
        {/* Right panel - Sign In Form */}
        <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold text-midnight-blue dark:text-cosmic-latte mb-6">Sign in to your account</h2>
            <p className="text-cosmic-grey dark:text-stardust mb-8">
              Access your AI-powered second brain and tools.
            </p>
            
            <div className="mb-4">
              <AuthStatusIndicator />
            </div>
            
            {errors.general && (
              <div className="mb-6 p-4 bg-electric-crimson bg-opacity-10 border border-electric-crimson border-opacity-50 rounded-md text-electric-crimson">
                {errors.general}
              </div>
            )}

            {showDiagnostics && authDiagnostics && (
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm">
                <h3 className="font-medium mb-2">Auth Diagnostics:</h3>
                <div className="max-h-56 overflow-auto">
                  <pre className="whitespace-pre-wrap break-words text-xs">
                    {JSON.stringify(authDiagnostics, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-midnight-blue dark:text-cosmic-latte mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={`w-full px-4 py-3 bg-white dark:bg-cosmic-grey dark:bg-opacity-20 rounded-md border ${errors.email ? 'border-electric-crimson' : 'border-cosmic-grey dark:border-stardust border-opacity-30 dark:border-opacity-30'} text-midnight-blue dark:text-nebula-white placeholder-cosmic-grey dark:placeholder-stardust placeholder-opacity-70 dark:placeholder-opacity-70 focus:outline-none focus:border-electric-indigo transition-colors duration-300`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-electric-crimson">{errors.email}</p>}
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-midnight-blue dark:text-cosmic-latte">
                    Password
                  </label>
                  <a href="#" className="text-sm text-electric-indigo hover:underline">
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 bg-white dark:bg-cosmic-grey dark:bg-opacity-20 rounded-md border ${errors.password ? 'border-electric-crimson' : 'border-cosmic-grey dark:border-stardust border-opacity-30 dark:border-opacity-30'} text-midnight-blue dark:text-nebula-white placeholder-cosmic-grey dark:placeholder-stardust placeholder-opacity-70 dark:placeholder-opacity-70 focus:outline-none focus:border-electric-indigo transition-colors duration-300`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="mt-1 text-sm text-electric-crimson">{errors.password}</p>}
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-electric-indigo focus:ring-electric-indigo border-cosmic-grey rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-cosmic-grey dark:text-stardust">
                  Remember me
                </label>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-electric-indigo hover:bg-opacity-90 text-nebula-white text-center px-4 py-3 rounded-md font-medium transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : 'Sign In'}
                </button>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-cosmic-grey dark:text-stardust">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/landing/register"
                    className="text-electric-indigo hover:underline"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage; 