import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

// Import components
import {
  ProgressSteps,
  IntroductionStep,
  DataSourcesStep,
  CustomizeStep,
  ConfirmationStep,
  VoiceInteractionStep,
  DataSource,
  Preferences
} from './components';

const OnboardingPage: FC = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [userProject, setUserProject] = useState<string>('');
  const [preferences, setPreferences] = useState<Preferences>({
    notificationFrequency: 'daily',
    dataPrivacy: 'private',
    aiSuggestions: true,
  });
  const totalSteps = 5; // Updated total steps to include voice interaction

  // Check system preference and user data on load
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

    // Check if user is authenticated
    const storedUserData = localStorage.getItem('cco_user');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      if (parsedUserData.isAuthenticated) {
        setUserData(parsedUserData);
      } else {
        router.push('/landing/signin');
      }
    } else {
      router.push('/landing/signin');
    }
  }, [router]);

  const toggleSource = (source: string) => {
    setSelectedSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source) 
        : [...prev, source]
    );
  };

  const handleContinue = () => {
    setCurrentStep(prevStep => Math.min(prevStep + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 1));
  };

  const handleSourceConnect = () => {
    setIsProcessing(true);
    
    // Simulate API call for connecting data sources
    setTimeout(() => {
      // Move to the next step (customize)
      setIsProcessing(false);
      handleContinue();
    }, 2000);
  };

  const handleFinish = () => {
    setIsProcessing(true);
    
    // Simulate API call for completing setup
    setTimeout(() => {
      // Update user data with selected sources and preferences
      const updatedUserData = {
        ...userData,
        dataSources: selectedSources,
        preferences: preferences,
        userProject: userProject,
        onboardingComplete: true
      };
      
      localStorage.setItem('cco_user', JSON.stringify(updatedUserData));
      
      // Simulate completion
      setIsProcessing(false);
      router.push('/dashboard'); // Redirect to dashboard
    }, 2000);
  };

  const handleSkip = () => {
    // If on the voice interaction step, just move to the introduction step
    if (currentStep === 1) {
      handleContinue();
      return;
    }
    
    // Create empty second brain without data sources
    const updatedUserData = {
      ...userData,
      dataSources: [],
      preferences: preferences,
      userProject: userProject,
      onboardingComplete: true
    };
    
    localStorage.setItem('cco_user', JSON.stringify(updatedUserData));
    router.push('/dashboard'); // Redirect to dashboard
  };

  // Step label names updated to include voice interaction
  const stepLabels = ['Voice', 'Introduction', 'Data Sources', 'Customize', 'Finish'];
  
  const dataSources: DataSource[] = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Import your professional profile, skills, and connections',
      icon: (
        <svg className="w-8 h-8 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      description: 'Import your tweets, interests, and network',
      icon: (
        <svg className="w-8 h-8 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Import your code repositories, contributions, and technical skills',
      icon: (
        <svg className="w-8 h-8 text-[#181717]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.24.73-.53v-1.85c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.95-.61.1-.6.1-.6 1.1 0 1.73 1.1 1.73 1.1.93 1.63 2.57 1.16 3.2.9.1-.7.35-1.17.64-1.44-2.34-.25-4.8-1.12-4.8-5.04 0-1.11.38-2.03 1.03-2.75-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.81-.22 1.68-.33 2.53-.34.85.01 1.72.12 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.4.1 2.64.65.72 1.03 1.64 1.03 2.75 0 3.94-2.46 4.8-4.8 5.05.35.3.67.9.67 1.8v2.67c0 .3.19.64.73.54A11 11 0 0012 1.27"/>
        </svg>
      )
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Import your files, documents, and shared content',
      icon: (
        <svg className="w-8 h-8 text-[#0061FF]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14.56l4.07-3.32 4.07 3.32-4.07 3.32L12 14.56zm0-5.04l4.07 3.32 4.07-3.32-4.07-3.32L12 9.52zm-8.14 5.04l4.07 3.32 4.07-3.32-4.07-3.32-4.07 3.32zm0-5.04l4.07 3.32 4.07-3.32-4.07-3.32-4.07 3.32zM7.93 17.88L12 14.56l4.07 3.32-4.07 3.32-4.07-3.32z"/>
        </svg>
      )
    },
    {
      id: 'google',
      name: 'Google Drive',
      description: 'Import your documents, spreadsheets, and shared files',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24">
          <path d="M4.433 22l-2.933-5.004 2.933-5.002 2.933 5.002L4.433 22zm7.567 0l-2.933-5.004 2.933-5.002 2.933 5.002L12 22zm7.567 0l-2.933-5.004L19.567 12 22.5 17.002 19.567 22zM12 12.004L9.067 7 12 2.004 14.933 7 12 12.004z" fill="#FFC107"/>
          <path d="M9.067 7H4.2L1.267 12.004h4.867L9.067 7z" fill="#1976D2"/>
          <path d="M14.933 7H9.067l2.933 5.004h4.867L14.933 7z" fill="#4CAF50"/>
          <path d="M19.8 7h-4.867l2.933 5.004H22.5L19.8 7z" fill="#4CAF50"/>
          <path d="M4.2 17.002h4.867l-2.933-5.002H1.267l2.933 5.002z" fill="#F44336"/>
          <path d="M9.067 17.002h5.866l-2.933-5.002H6.133l2.934 5.002z" fill="#DD2C00"/>
          <path d="M19.8 17.002l-4.867-5.002 2.933 5.002h1.934z" fill="#1976D2"/>
        </svg>
      )
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Import your workspace conversations and shared knowledge',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24">
          <path d="M6.527 15.556c0 1.119-.903 2.022-2.022 2.022s-2.022-.903-2.022-2.022.903-2.022 2.022-2.022h2.022v2.022zm1.022 0c0-1.119.903-2.022 2.022-2.022s2.022.903 2.022 2.022v5.043c0 1.119-.903 2.022-2.022 2.022s-2.022-.903-2.022-2.022v-5.043z" fill="#E01E5A"/>
          <path d="M8.443 6.492c-1.119 0-2.022-.903-2.022-2.022s.903-2.022 2.022-2.022 2.022.903 2.022 2.022v2.022H8.443zm0 1.022c1.119 0 2.022.903 2.022 2.022s-.903 2.022-2.022 2.022H3.549c-1.119 0-2.022-.903-2.022-2.022s.903-2.022 2.022-2.022h4.894z" fill="#36C5F0"/>
          <path d="M17.507 8.557c0-1.119.903-2.022 2.022-2.022s2.022.903 2.022 2.022-.903 2.022-2.022 2.022h-2.022V8.557zm-1.022 0c0 1.119-.903 2.022-2.022 2.022s-2.022-.903-2.022-2.022V3.471c0-1.119.903-2.022 2.022-2.022s2.022.903 2.022 2.022v5.086z" fill="#2EB67D"/>
          <path d="M15.556 17.507c1.119 0 2.022.903 2.022 2.022s-.903 2.022-2.022 2.022-2.022-.903-2.022-2.022v-2.022h2.022zm0-1.022c-1.119 0-2.022-.903-2.022-2.022s.903-2.022 2.022-2.022h4.894c1.119 0 2.022.903 2.022 2.022s-.903 2.022-2.022 2.022h-4.894z" fill="#ECB22E"/>
        </svg>
      )
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Import your notes, databases, and knowledge base',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24">
          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm1.775 2.986c.746.56 1.682.466 3.107.326l11.535-.84c.28-.046.374-.168.374-.373V3.813c0-.28-.19-.326-.42-.28l-14.268.886c-.28.046-.374.28-.374.56v2.613c0 .093.047.28.047.603zm11.535 1.776l-11.535.84c-.748.046-1.542-.186-1.542-1.26V7.935c0-.746.28-1.26 1.072-1.353L17.54 5.745c.7-.047 1.261.42 1.261 1.166v1.82c0 .747-.56 1.26-1.03 1.24zm0 7.645c.84-.046 1.030-.56 1.030-1.26v-1.166l-13.35.98c-.048 0-.048.046-.048.093v3.568c0 .793.28 1.12 1.082 1.493l2.762 1.25c.34.14.794.233 1.214.233l10.143-.746c.7-.046 1.03-.513 1.03-1.213v-1.4c0-.653-.187-1.166-1.03-1.213l-2.833-.187z" fillRule="evenodd"/>
        </svg>
      )
    }
  ];
  
  return (
    <div className="bg-white dark:bg-midnight-blue min-h-screen flex flex-col transition-colors duration-300">
      <Head>
        <title>Create Your Second Brain - CCO</title>
        <meta name="description" content="Import your data to create your personalized AI-powered second brain" />
      </Head>

      <div className="px-6 py-4 border-b border-cosmic-grey dark:border-stardust border-opacity-10 dark:border-opacity-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="inline-flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-electric-indigo to-neon-teal bg-clip-text text-transparent">CCO</span>
          </Link>
          
          {userData && (
            <div className="flex items-center space-x-4">
              <span className="text-cosmic-grey dark:text-stardust">
                {userData.name}
              </span>
              <div className="w-8 h-8 rounded-full bg-electric-indigo flex items-center justify-center text-nebula-white font-medium">
                {userData.name.charAt(0)}
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <ProgressSteps 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
            stepLabels={stepLabels}
          />
          
          {/* Step Title */}
          {currentStep === 1 ? (
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-midnight-blue dark:text-cosmic-latte mb-4">
                Let's Start the Conversation
              </h1>
              <p className="text-xl text-cosmic-grey dark:text-stardust max-w-2xl mx-auto">
                Tell me about your first project to help me understand your needs better.
              </p>
            </div>
          ) : currentStep === 2 ? (
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-midnight-blue dark:text-cosmic-latte mb-4">
                Create Your Second Brain
              </h1>
              <p className="text-xl text-cosmic-grey dark:text-stardust max-w-2xl mx-auto">
                Import your data from various platforms to build a personalized knowledge base that will power your CCO experience.
              </p>
            </div>
          ) : currentStep === 3 ? (
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-midnight-blue dark:text-cosmic-latte mb-4">
                Connect Your Data Sources
              </h1>
              <p className="text-xl text-cosmic-grey dark:text-stardust max-w-2xl mx-auto">
                Select the platforms you'd like to connect to build your second brain knowledge base.
              </p>
            </div>
          ) : currentStep === 4 ? (
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-midnight-blue dark:text-cosmic-latte mb-4">
                Customize Your Experience
              </h1>
              <p className="text-xl text-cosmic-grey dark:text-stardust max-w-2xl mx-auto">
                Set your preferences for how your Second Brain will work for you.
              </p>
            </div>
          ) : (
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-midnight-blue dark:text-cosmic-latte mb-4">
                Ready to Launch Your Second Brain
              </h1>
              <p className="text-xl text-cosmic-grey dark:text-stardust max-w-2xl mx-auto">
                Review your selections and complete the setup process.
              </p>
            </div>
          )}
          
          {/* Step Content */}
          {currentStep === 1 ? (
            <VoiceInteractionStep 
              onContinue={() => {
                // Store what the user said and continue
                const transcript = document.querySelector('.whitespace-pre-wrap')?.textContent || '';
                if (transcript && transcript !== 'Click "Start Recording" to tell me about your first project.') {
                  setUserProject(transcript);
                }
                handleContinue();
              }} 
              onSkip={handleSkip} 
            />
          ) : currentStep === 2 ? (
            <IntroductionStep 
              onContinue={handleContinue} 
              onSkip={handleSkip} 
            />
          ) : currentStep === 3 ? (
            <DataSourcesStep 
              dataSources={dataSources}
              selectedSources={selectedSources}
              toggleSource={toggleSource}
              onContinue={handleSourceConnect}
              onBack={handleBack}
              onSkip={handleSkip}
              isProcessing={isProcessing}
            />
          ) : currentStep === 4 ? (
            <CustomizeStep 
              preferences={preferences}
              setPreferences={setPreferences}
              onContinue={handleContinue}
              onBack={handleBack}
            />
          ) : (
            <ConfirmationStep 
              selectedSources={selectedSources}
              dataSources={dataSources}
              preferences={preferences}
              userProject={userProject}
              onFinish={handleFinish}
              onBack={handleBack}
              isProcessing={isProcessing}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage; 