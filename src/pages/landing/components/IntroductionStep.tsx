import React from 'react';
import type { FC } from 'react';

interface IntroductionStepProps {
  onContinue: () => void;
  onSkip: () => void;
}

const IntroductionStep: FC<IntroductionStepProps> = ({ onContinue, onSkip }) => {
  return (
    <div className="bg-nebula-white dark:bg-cosmic-grey dark:bg-opacity-20 rounded-xl p-8 md:p-12 shadow-lg">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-semibold text-midnight-blue dark:text-cosmic-latte mb-4">
            What is a Second Brain?
          </h2>
          <p className="text-cosmic-grey dark:text-stardust mb-4">
            Your second brain is a personal knowledge base that stores and organizes information from various sources, creating a searchable repository of your professional knowledge and expertise.
          </p>
          <p className="text-cosmic-grey dark:text-stardust mb-6">
            By importing data from platforms like LinkedIn, GitHub, Dropbox, and more, CCO can build a comprehensive profile of your skills, experiences, and work to assist you during meetings and help potential clients discover you.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="text-electric-indigo">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-midnight-blue dark:text-cosmic-latte">Personalized Meeting Assistance</h3>
                <p className="text-sm text-cosmic-grey dark:text-stardust">Get real-time guidance based on your expertise</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="text-electric-indigo">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-midnight-blue dark:text-cosmic-latte">Tailored PRD Generation</h3>
                <p className="text-sm text-cosmic-grey dark:text-stardust">Documents created with your unique perspective</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="text-electric-indigo">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-midnight-blue dark:text-cosmic-latte">Client Matching</h3>
                <p className="text-sm text-cosmic-grey dark:text-stardust">Clients can "interview" your CCO to assess fit</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <div className="bg-white dark:bg-obsidian p-6 rounded-lg border border-cosmic-grey dark:border-stardust border-opacity-20 dark:border-opacity-20">
            <h3 className="text-xl font-medium text-midnight-blue dark:text-cosmic-latte mb-4">Getting Started</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-electric-indigo bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center text-electric-indigo">
                  1
                </div>
                <p className="text-cosmic-grey dark:text-stardust">Select data sources to import</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-electric-indigo bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center text-electric-indigo">
                  2
                </div>
                <p className="text-cosmic-grey dark:text-stardust">Authenticate with each platform</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-electric-indigo bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center text-electric-indigo">
                  3
                </div>
                <p className="text-cosmic-grey dark:text-stardust">CCO will analyze and organize your data</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-electric-indigo bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center text-electric-indigo">
                  4
                </div>
                <p className="text-cosmic-grey dark:text-stardust">Your second brain is ready to use</p>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={onContinue}
                className="w-full bg-electric-indigo hover:bg-opacity-90 text-nebula-white text-center px-4 py-3 rounded-md font-medium transition-all"
              >
                Connect Data Sources
              </button>
              
              <button
                onClick={onSkip}
                className="w-full border border-cosmic-grey dark:border-stardust border-opacity-30 dark:border-opacity-30 text-cosmic-grey dark:text-stardust hover:text-electric-indigo dark:hover:text-electric-indigo hover:border-electric-indigo dark:hover:border-electric-indigo text-center px-4 py-3 rounded-md font-medium transition-all"
              >
                Skip & Create Empty Second Brain
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroductionStep; 