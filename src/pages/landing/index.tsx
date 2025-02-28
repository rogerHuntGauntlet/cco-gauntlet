import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import Head from 'next/head';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

const LandingPage: FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  
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

    // Listen for changes in system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only apply system preference if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <div className="bg-white dark:bg-midnight-blue min-h-screen text-midnight-blue dark:text-nebula-white transition-colors duration-300">
      <Head>
        <title>CCO - Chief Cognitive Officer</title>
        <meta name="description" content="AI-powered productivity platform for vibe coders - eliminating administrative overhead and enhancing developer flow" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jetbrains-mono@1.0.6/css/jetbrains-mono.min.css" />
      </Head>
      
      {/* Theme toggle button */}
      <button 
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        className="fixed top-6 right-6 z-50 p-2 rounded-full bg-cosmic-grey dark:bg-nebula-white bg-opacity-20 dark:bg-opacity-20 transition-colors duration-300"
        onClick={toggleTheme}
      >
        {isDarkMode ? (
          <svg className="w-6 h-6 text-nebula-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-midnight-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <main>
        <HeroSection isDarkMode={isDarkMode} />
        <FeaturesSection isDarkMode={isDarkMode} />
        <HowItWorksSection isDarkMode={isDarkMode} />
        <CallToAction isDarkMode={isDarkMode} />
      </main>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default LandingPage; 