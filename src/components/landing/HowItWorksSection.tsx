import React from 'react';
import type { FC } from 'react';

interface HowItWorksSectionProps {
  isDarkMode?: boolean;
}

const Step: FC<{
  number: number;
  title: string;
  description: string;
}> = ({ number, title, description }) => {
  return (
    <div className="flex items-start gap-6">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-electric-indigo flex items-center justify-center text-nebula-white font-semibold text-xl">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-medium text-midnight-blue dark:text-cosmic-latte mb-2">{title}</h3>
        <p className="text-cosmic-grey dark:text-stardust">{description}</p>
      </div>
    </div>
  );
};

const HowItWorksSection: FC<HowItWorksSectionProps> = ({ isDarkMode }) => {
  return (
    <section id="how-it-works" className="py-20 px-6 md:px-12 lg:px-24 bg-nebula-white dark:bg-obsidian transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-midnight-blue dark:text-cosmic-latte mb-4">How CCO Works</h2>
          <p className="text-xl text-cosmic-grey dark:text-stardust max-w-2xl mx-auto">
            Simple integration with your workflow, powerful results for your productivity.
          </p>
        </div>
        
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-electric-indigo hidden md:block"></div>
          
          {/* Steps */}
          <div className="space-y-16 relative">
            <Step 
              number={1}
              title="Connect Your Accounts"
              description="Link your Google Drive, Dropbox, calendar, and other data sources to personalize your CCO."
            />
            
            <Step 
              number={2}
              title="Join Meetings with CCO"
              description="The CCO Zoom widget joins your client meetings, provides real-time guidance, and captures key information."
            />
            
            <Step 
              number={3}
              title="Receive Auto-Generated Resources"
              description="After each meeting, CCO automatically generates comprehensive documentation, PRDs, and starter code repositories."
            />
            
            <Step 
              number={4}
              title="Start Coding Immediately"
              description="Jump straight into development with a project structure that matches the meeting requirements."
            />
            
            <Step 
              number={5}
              title="Expand Your Network"
              description="Connect with clients or find vibe coders through the CCO marketplace, using AI-powered matching."
            />
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-block p-6 bg-white dark:bg-midnight-blue rounded-lg border border-cosmic-grey border-opacity-10 dark:border-stardust dark:border-opacity-20 shadow-md transition-colors duration-300">
            <p className="text-xl text-midnight-blue dark:text-cosmic-latte mb-4">Ready to enhance your productivity?</p>
            <button className="bg-neon-teal text-midnight-blue dark:text-obsidian px-8 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all shadow-md">
              Try CCO Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 