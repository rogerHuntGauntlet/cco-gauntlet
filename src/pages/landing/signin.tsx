import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

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
    general: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call for login
      setTimeout(() => {
        // For demo purposes, create a dummy user if one doesn't exist
        const userData = localStorage.getItem('cco_user');
        
        if (userData) {
          const user = JSON.parse(userData);
          if (user.email === formData.email) {
            // Update auth status
            user.isAuthenticated = true;
            localStorage.setItem('cco_user', JSON.stringify(user));
            
            // Redirect to dashboard or onboarding
            router.push('/landing/onboarding');
          } else {
            setErrors(prev => ({ ...prev, general: 'Invalid email or password' }));
            setIsSubmitting(false);
          }
        } else {
          // No existing user, create a dummy one (for demo)
          localStorage.setItem('cco_user', JSON.stringify({
            name: 'Demo User',
            email: formData.email,
            isAuthenticated: true
          }));
          
          // Redirect to onboarding
          router.push('/landing/onboarding');
        }
      }, 1500);
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
            
            {errors.general && (
              <div className="mb-6 p-4 bg-electric-crimson bg-opacity-10 border border-electric-crimson border-opacity-50 rounded-md">
                <p className="text-electric-crimson">{errors.general}</p>
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
                  Don't have an account?{' '}
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