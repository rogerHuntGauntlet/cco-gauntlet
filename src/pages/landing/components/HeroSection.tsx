import React from 'react';
import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeroSectionProps {
  isDarkMode?: boolean;
}

const HeroSection: FC<HeroSectionProps> = ({ isDarkMode }) => {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-nebula-white to-cosmic-latte dark:from-midnight-blue dark:to-obsidian transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-midnight-blue dark:text-cosmic-latte mb-6 leading-tight">
              Your AI-Powered <span className="text-electric-indigo">Cognitive Officer</span>
            </h1>
            <p className="text-xl text-cosmic-grey dark:text-nebula-white mb-8 max-w-lg">
              Eliminate administrative overhead and stay in your coding flow. Let CCO handle your meetings, documentation, and project kickoffs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/landing/register" 
                className="bg-electric-indigo hover:bg-opacity-90 text-nebula-white px-8 py-3 rounded-md font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Get Started
              </Link>
              <Link 
                href="#how-it-works" 
                className="border border-electric-indigo text-electric-indigo hover:text-midnight-blue hover:border-midnight-blue dark:border-digital-lavender dark:text-digital-lavender dark:hover:text-nebula-white dark:hover:border-nebula-white px-8 py-3 rounded-md font-medium transition-all"
              >
                How It Works
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="relative w-full h-[400px] md:h-[480px]">
              {/* Background changes based on theme */}
              <div className="absolute inset-0 bg-gradient-to-br from-electric-indigo via-neon-teal to-digital-lavender opacity-10 dark:opacity-20 rounded-2xl animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4">
                <div className="w-full h-full relative">
                  {/* Placeholder for hero image/illustration */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-24 h-24 text-electric-indigo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 