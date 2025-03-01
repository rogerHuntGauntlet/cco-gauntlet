import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { signUp } from '../../utils/supabaseClient';

const RegisterPage: FC = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',  // Added for general errors
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

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Use Supabase for registration
        const { data, error } = await signUp(formData.email, formData.password);
        
        if (error) {
          setErrors(prev => ({ ...prev, general: error.message || 'Registration failed' }));
          setIsSubmitting(false);
          return;
        }
        
        if (data) {
          // Store user's name in local storage to be used later
          localStorage.setItem('user_name', formData.name);
          
          // After successful signup, redirect to onboarding
          router.push('/landing/onboarding');
        } else {
          setErrors(prev => ({ ...prev, general: 'An unexpected error occurred' }));
          setIsSubmitting(false);
        }
      } catch (err) {
        console.error('Registration error:', err);
        setErrors(prev => ({ ...prev, general: 'An unexpected error occurred' }));
        setIsSubmitting(false);
      }
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
              
              <div className="text-center mt-6">
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
    </div>
  );
};

export default RegisterPage; 