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
      
      // Use our new comprehensive diagnosis endpoint instead
      const response = await fetch('/api/diagnose-auth');
      const data = await response.json();
      
      setAuthDiagnostics(data);
      setShowDiagnostics(true);
      setIsSubmitting(false);
      
      // Check if there are cookie issues
      const hasCookieIssues = !data.client.cookies.present || !data.client.cookies.authCookiesFound;
      
      // If there are recommendations, show them as part of the error message
      if (data.recommendations && data.recommendations.length > 0) {
        setErrors(prev => ({
          ...prev,
          general: (
            <>
              <div className="font-medium mb-1">Authentication Diagnostic Results:</div>
              <div className="mb-3">
                {data.infrastructure.auth.operational ? 
                  'Auth service is operational, but there might be configuration or browser issues.' : 
                  'Auth service is not responding correctly.'}
              </div>
              
              {hasCookieIssues && (
                <div className="p-3 mb-3 bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-30 rounded border border-yellow-300 dark:border-yellow-700">
                  <div className="font-medium text-yellow-800 dark:text-yellow-300">Cookie Issue Detected</div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Your browser is {!data.client.cookies.present ? 'not sending any cookies' : 'missing authentication cookies'}.
                    This is the most common cause of authentication problems.
                  </p>
                </div>
              )}
              
              <div className="font-medium">Recommendations:</div>
              <ul className="list-disc pl-5 space-y-1 mb-3">
                {data.recommendations.map((rec: string, i: number) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
              
              {hasCookieIssues && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={testCookies}
                    className="px-3 py-1 bg-electric-indigo text-white text-sm rounded hover:bg-opacity-90"
                  >
                    Test Cookie Storage
                  </button>
                </div>
              )}
              
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <div>Environment: {data.environment.nodeEnv}</div>
                  <div>DB Connected: {data.infrastructure.database.connected ? 'Yes' : 'No'}</div>
                  <div>Browser: {data.client.userAgent.split(') ')[0].split(' (')[0]}</div>
                  <div>Cookies: {data.client.cookies.count} (Auth cookies: {data.client.cookies.authCookiesFound ? 'Yes' : 'No'})</div>
                  {data.client.potentialIssues.length > 0 && (
                    <div className="mt-1">
                      <div>Potential issues:</div>
                      <ul className="list-disc pl-5">
                        {data.client.potentialIssues.map((issue: string, i: number) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )
        }));
      }
    } catch (err) {
      console.error('Error fetching auth diagnostics:', err);
      setAuthDiagnostics({ error: 'Failed to fetch auth diagnostics' });
      setShowDiagnostics(true);
      setIsSubmitting(false);
    }
  };
  
  // Test if cookies can be stored
  const testCookies = () => {
    try {
      // Try to set a test cookie
      const testValue = `test-${new Date().getTime()}`;
      document.cookie = `auth_test=${testValue}; path=/`;
      
      // Check if cookie was set
      const cookieSet = document.cookie.includes(`auth_test=${testValue}`);
      
      if (cookieSet) {
        setErrors(prev => ({
          ...prev,
          general: (
            <>
              <div className="p-3 bg-green-100 dark:bg-green-900 dark:bg-opacity-30 rounded border border-green-300 dark:border-green-700">
                <div className="font-medium text-green-800 dark:text-green-300">Cookie Test Passed</div>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Your browser successfully stored a test cookie. Try these steps to fix authentication:
                </p>
                <ol className="list-decimal pl-5 text-sm mt-2 text-green-700 dark:text-green-400">
                  <li>Clear your browser cookies and cache</li>
                  <li>Disable any ad-blockers or privacy extensions</li>
                  <li>Try signing in again</li>
                </ol>
              </div>
            </>
          )
        }));
        
        // Clean up test cookie
        document.cookie = "auth_test=; max-age=0; path=/";
      } else {
        setErrors(prev => ({
          ...prev,
          general: (
            <>
              <div className="p-3 bg-electric-crimson bg-opacity-10 rounded border border-electric-crimson">
                <div className="font-medium text-electric-crimson">Cookie Storage Blocked</div>
                <p className="text-sm">
                  Your browser is blocking cookie storage. This prevents authentication from working.
                  To fix this issue:
                </p>
                <ol className="list-decimal pl-5 text-sm mt-2">
                  <li>Check your browser privacy settings</li>
                  <li>Allow cookies for this website</li>
                  <li>Disable privacy extensions or ad-blockers</li>
                  <li>Try a different browser (Chrome or Firefox)</li>
                </ol>
              </div>
            </>
          )
        }));
      }
    } catch (e) {
      console.error('Error in cookie test:', e);
      setErrors(prev => ({
        ...prev,
        general: (
          <>
            <div className="p-3 bg-electric-crimson bg-opacity-10 rounded border border-electric-crimson">
              <div className="font-medium text-electric-crimson">Cookie Access Error</div>
              <p className="text-sm">
                An error occurred while testing cookie storage: {e instanceof Error ? e.message : String(e)}
              </p>
              <p className="text-sm mt-2">
                This likely indicates your browser has strict privacy settings or extensions blocking cookies.
              </p>
            </div>
          </>
        )
      }));
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
        // Pre-check: Test if cookies can be set
        const testValue = `test-${new Date().getTime()}`;
        document.cookie = `signin_test=${testValue}; path=/`;
        const cookieWorks = document.cookie.includes(`signin_test=${testValue}`);
        
        if (!cookieWorks) {
          console.warn('Cookie test failed - browser is blocking cookies');
          setErrors(prev => ({ 
            ...prev, 
            general: (
              <>
                <div className="p-3 bg-electric-crimson bg-opacity-10 rounded border border-electric-crimson">
                  <div className="font-medium text-electric-crimson">Cookie Storage Blocked</div>
                  <p className="text-sm">
                    Your browser is blocking cookies, which prevents authentication from working.
                    Please adjust your browser settings to allow cookies for this website.
                  </p>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={testCookies}
                      className="px-3 py-1 bg-electric-indigo text-white text-sm rounded hover:bg-opacity-90"
                    >
                      Detailed Cookie Diagnostics
                    </button>
                  </div>
                </div>
              </>
            )
          }));
          setIsSubmitting(false);
          return;
        }
        
        // Clean up test cookie
        document.cookie = "signin_test=; max-age=0; path=/";
        
        // Use Supabase for authentication
        console.log('Credentials prepared, calling signIn function...');
        const { data, error } = await signIn(formData.email, formData.password);
        
        // IMPORTANT: Check if we have a session, even if there was an error
        // This handles cases where Supabase returns errors but the user is actually authenticated
        if (data?.session || (data as any)?.user) {
          console.log('Sign-in successful (data is present), preparing redirect...');
          // Always redirect to dashboard after successful login
          console.log('Redirecting to dashboard...');
          router.push('/dashboard');
          return;
        }
        
        if (error) {
          console.error('Supabase auth error:', error);
          // Log more details about the error
          console.error('Error details:', JSON.stringify(error, null, 2));
          
          // Before showing error, double-check if we're actually logged in despite the error
          try {
            const sessionCheck = await supabase.auth.getSession();
            if (sessionCheck.data?.session) {
              console.log('Session exists despite error - proceeding with login');
              router.push('/dashboard');
              return;
            }
          } catch (sessionError) {
            console.error('Session check failed:', sessionError);
          }
          
          // Show a more helpful error message with debug bypass option for backend errors
          const isBackendError = error.status === 500 || 
                                error.message?.includes('unavailable') ||
                                error.message?.includes('Authentication service') ||
                                error.message?.includes('Database error');
          
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
                      <li>Check if your browser is blocking cookies</li>
                    </ol>
                    
                    <div className="mt-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <button 
                        type="button"
                        onClick={checkAuthStatus}
                        className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        Check Auth Status
                      </button>
                      
                      <button 
                        type="button"
                        onClick={testCookies}
                        className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        Test Cookies
                      </button>
                      
                      {process.env.NODE_ENV === 'development' && (
                        <Link 
                          href="/dashboard?debugBypass=true" 
                          className="text-sm text-center px-3 py-1 text-electric-indigo border border-electric-indigo rounded hover:bg-electric-indigo hover:bg-opacity-10 transition-colors"
                        >
                          Bypass Login (Dev Only)
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </>
            )
          }));
          setIsSubmitting(false);
          return;
        }
        
        if (data) {
          console.log('Sign-in successful, preparing redirect...');
          // Always redirect to dashboard after successful login
          console.log('Redirecting to dashboard...');
          router.push('/dashboard');
        } else {
          console.error('No user data returned but no error either, checking session directly');
          
          // Last-attempt check to see if we're logged in anyway
          try {
            const sessionCheck = await supabase.auth.getSession();
            if (sessionCheck.data?.session) {
              console.log('Found valid session - proceeding with login despite missing user data');
              router.push('/dashboard');
              return;
            }
          } catch (sessionError) {
            console.error('Final session check failed:', sessionError);
          }
          
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
                    <span className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : 'Sign in'}
                </button>
              </div>
              
              <div className="mt-6">
                <SocialLoginButtons />
              </div>
              
              <div className="text-center mt-4">
                <span className="text-cosmic-grey dark:text-stardust">Don't have an account?</span>
                <Link href="/landing/register" className="ml-1 text-electric-indigo hover:text-electric-indigo-dark hover:underline">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage; 