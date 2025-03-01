import React from 'react';
import type { FC } from 'react';

interface FeaturesSectionProps {
  isDarkMode?: boolean;
}

const FeatureCard: FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
}> = ({ title, description, icon }) => {
  return (
    <div className="bg-nebula-white bg-opacity-50 dark:bg-cosmic-grey dark:bg-opacity-30 p-8 rounded-lg border border-cosmic-grey border-opacity-10 dark:border-stardust dark:border-opacity-20 transition-all hover:transform hover:scale-105 hover:shadow-lg">
      <div className="h-14 w-14 rounded-full bg-electric-indigo bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-medium text-midnight-blue dark:text-cosmic-latte mb-3">{title}</h3>
      <p className="text-cosmic-grey dark:text-stardust">{description}</p>
    </div>
  );
};

const FeaturesSection: FC<FeaturesSectionProps> = ({ isDarkMode }) => {
  const features = [
    {
      title: "Meeting Assistant",
      description: "Get real-time meeting guidance and automated documentation with our Zoom integration.",
      icon: (
        <svg className="w-7 h-7 text-electric-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Automated Documentation",
      description: "Convert meetings into comprehensive notes, PRDs, and specifications without manual effort.",
      icon: (
        <svg className="w-7 h-7 text-electric-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Code Repository Generation",
      description: "Start coding immediately with auto-generated project scaffolding based on meeting discussions.",
      icon: (
        <svg className="w-7 h-7 text-electric-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      title: "Vibe Coder Marketplace",
      description: "Find your perfect creative developer partner through our AI-powered matching system.",
      icon: (
        <svg className="w-7 h-7 text-electric-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Personalized AI Training",
      description: "Connect your data sources for a CCO that understands your unique workflow and preferences.",
      icon: (
        <svg className="w-7 h-7 text-electric-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Flow-Oriented Experience",
      description: "Our interface is designed for vibe coders who prioritize creativity and uninterrupted workflow.",
      icon: (
        <svg className="w-7 h-7 text-electric-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-cosmic-latte dark:bg-midnight-blue transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-midnight-blue dark:text-cosmic-latte mb-4">Features designed for <span className="text-electric-indigo">vibe coders</span></h2>
          <p className="text-xl text-cosmic-grey dark:text-stardust max-w-2xl mx-auto">
            Eliminating administrative overhead so you can focus on what you do best: creating amazing code.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 