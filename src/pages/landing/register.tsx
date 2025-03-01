import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { signInWithProvider } from '../../utils/supabaseClient';

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
          Or sign up with
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

const RegisterPage: FC = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    terms: false,
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const newErrors = { ...errors };

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else {
      newErrors.name = '';
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else {
      newErrors.password = '';
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    } else {
      newErrors.confirmPassword = '';
    }

    // Validate terms agreement
    if (!formData.terms) {
      newErrors.terms = 'You must agree to the terms and conditions';
      isValid = false;
    } else {
      newErrors.terms = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call for creating account
      setTimeout(() => {
        // Store user data in localStorage (for demo purposes only)
        localStorage.setItem('cco_user', JSON.stringify({
          name: formData.name,
          email: formData.email,
          isAuthenticated: true
        }));
        
        // Redirect to onboarding
        router.push('/landing/onboarding');
      }, 1500);
    }
  };

  return (
    <div className="bg-white dark:bg-midnight-blue min-h-screen flex flex-col transition-colors duration-300">
      <Head>
        <title>Register - CCO</title>
        <meta name="description" content="Create your CCO account" />
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
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Join the community of vibe coders</h1>
            <p className="text-xl opacity-90 mb-8">
              Eliminate administrative overhead and enhance your creative flow with CCO.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">AI-powered meeting assistant</h3>
                  <p className="opacity-80">Get real-time guidance and automatic documentation</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Your personalized second brain</h3>
                  <p className="opacity-80">Import data from all your platforms to build your knowledge base</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Auto-generated code repositories</h3>
                  <p className="opacity-80">Start coding immediately after meetings</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-white text-sm opacity-70">
            © 2023 CCO. All rights reserved.
          </div>
        </div>
        
        {/* Right panel - Registration Form */}
        <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold text-midnight-blue dark:text-cosmic-latte mb-6">Create your account</h2>
            <p className="text-cosmic-grey dark:text-stardust mb-8">
              Start building your AI-powered second brain in minutes.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-midnight-blue dark:text-cosmic-latte mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-cosmic-grey dark:bg-opacity-20 rounded-md border ${errors.name ? 'border-electric-crimson' : 'border-cosmic-grey dark:border-stardust border-opacity-30 dark:border-opacity-30'} text-midnight-blue dark:text-nebula-white placeholder-cosmic-grey dark:placeholder-stardust placeholder-opacity-70 dark:placeholder-opacity-70 focus:outline-none focus:border-electric-indigo transition-colors duration-300`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="mt-1 text-sm text-electric-crimson">{errors.name}</p>}
              </div>
              
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
                  className={`w-full px-4 py-3 bg-white dark:bg-cosmic-grey dark:bg-opacity-20 rounded-md border ${errors.email ? 'border-electric-crimson' : 'border-cosmic-grey dark:border-stardust border-opacity-30 dark:border-opacity-30'} text-midnight-blue dark:text-nebula-white placeholder-cosmic-grey dark:placeholder-stardust placeholder-opacity-70 dark:placeholder-opacity-70 focus:outline-none focus:border-electric-indigo transition-colors duration-300`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-electric-crimson">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-midnight-blue dark:text-cosmic-latte mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-cosmic-grey dark:bg-opacity-20 rounded-md border ${errors.password ? 'border-electric-crimson' : 'border-cosmic-grey dark:border-stardust border-opacity-30 dark:border-opacity-30'} text-midnight-blue dark:text-nebula-white placeholder-cosmic-grey dark:placeholder-stardust placeholder-opacity-70 dark:placeholder-opacity-70 focus:outline-none focus:border-electric-indigo transition-colors duration-300`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="mt-1 text-sm text-electric-crimson">{errors.password}</p>}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-midnight-blue dark:text-cosmic-latte mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-cosmic-grey dark:bg-opacity-20 rounded-md border ${errors.confirmPassword ? 'border-electric-crimson' : 'border-cosmic-grey dark:border-stardust border-opacity-30 dark:border-opacity-30'} text-midnight-blue dark:text-nebula-white placeholder-cosmic-grey dark:placeholder-stardust placeholder-opacity-70 dark:placeholder-opacity-70 focus:outline-none focus:border-electric-indigo transition-colors duration-300`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-electric-crimson">{errors.confirmPassword}</p>}
              </div>
              
              <div className="mt-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.checked }))}
                      className="focus:ring-electric-indigo h-4 w-4 text-electric-indigo border-cosmic-grey dark:border-stardust rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-cosmic-grey dark:text-stardust">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-electric-indigo hover:underline"
                      >
                        Terms and Conditions
                      </button>
                    </label>
                    {errors.terms && <p className="mt-1 text-sm text-electric-crimson">{errors.terms}</p>}
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
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
                      Creating account...
                    </span>
                  ) : 'Create Account'}
                </button>
              </div>
              
              <div className="mt-6">
                <SocialLoginButtons />
              </div>
              
              <div className="text-center mt-4">
                <p className="text-cosmic-grey dark:text-stardust">
                  Already have an account?{' '}
                  <Link
                    href="/landing/signin"
                    className="text-electric-indigo hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Render Terms and Conditions Modal */}
      <TermsAndConditionsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
      />
    </div>
  );
};

const TermsAndConditionsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-midnight-blue rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-cosmic-grey dark:border-stardust border-opacity-20">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-midnight-blue dark:text-cosmic-latte">Terms and Conditions</h3>
            <button
              onClick={onClose}
              className="text-cosmic-grey hover:text-electric-crimson dark:text-stardust dark:hover:text-electric-crimson transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-auto flex-grow text-midnight-blue dark:text-cosmic-latte">
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium mb-2 text-midnight-blue dark:text-cosmic-latte">1. Introduction</h4>
              <p className="text-midnight-blue dark:text-nebula-white">Welcome to Chief Cognitive Officer ("CCO"), an AI-powered productivity platform designed for developers. By using our services, you agree to be bound by these Terms and Conditions.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2 text-midnight-blue dark:text-cosmic-latte">2. Platform Description</h4>
              <p className="text-midnight-blue dark:text-nebula-white">CCO is an intelligent assistant that integrates with Zoom meetings, providing real-time guidance and automatically generating documentation, specifications, and code repositories.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2 text-midnight-blue dark:text-cosmic-latte">3. Data Collection and Privacy</h4>
              <p className="text-midnight-blue dark:text-nebula-white">CCO processes meeting data to provide its services. We implement end-to-end encryption and have clear data retention policies to protect your privacy. By using CCO, you consent to the collection and processing of meeting data and other information imported from integrated services.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2 text-midnight-blue dark:text-cosmic-latte">4. Third-Party Integrations</h4>
              <p className="text-midnight-blue dark:text-nebula-white">CCO integrates with various third-party services including Zoom, Google Drive, Dropbox, Twitter, email, and calendar applications. Use of these integrations is subject to the respective terms and conditions of those services.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2 text-midnight-blue dark:text-cosmic-latte">5. User Responsibilities</h4>
              <p className="text-midnight-blue dark:text-nebula-white">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree not to use CCO for any illegal or unauthorized purpose.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2 text-midnight-blue dark:text-cosmic-latte">6. Content Ownership</h4>
              <p className="text-midnight-blue dark:text-nebula-white">You retain ownership of all content you provide to CCO. You grant CCO a license to use this content solely for the purpose of providing and improving our services.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2 text-midnight-blue dark:text-cosmic-latte">7. Marketplace</h4>
              <p className="text-midnight-blue dark:text-nebula-white">CCO may feature a marketplace connecting clients with developers. We do not guarantee the quality of services provided by developers or the satisfaction of clients with those services.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2 text-midnight-blue dark:text-cosmic-latte">8. Limitations of Liability</h4>
              <p className="text-midnight-blue dark:text-nebula-white">CCO is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, special, consequential or punitive damages arising from your use of the service.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2 text-midnight-blue dark:text-cosmic-latte">9. Modifications to Terms</h4>
              <p className="text-midnight-blue dark:text-nebula-white">We reserve the right to modify these terms at any time. Continued use of CCO after changes constitutes acceptance of the modified terms.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2 text-midnight-blue dark:text-cosmic-latte">10. Termination</h4>
              <p className="text-midnight-blue dark:text-nebula-white">We may terminate or suspend your account at our discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-cosmic-grey dark:border-stardust border-opacity-20">
          <button
            onClick={onClose}
            className="w-full bg-electric-indigo hover:bg-opacity-90 text-nebula-white text-center px-4 py-3 rounded-md font-medium transition-all"
          >
            I Understand and Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 