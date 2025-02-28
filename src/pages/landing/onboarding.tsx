import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const OnboardingPage: FC = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userData, setUserData] = useState<any>(null);

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
    setCurrentStep(2);
  };

  const handleSourceConnect = () => {
    setIsProcessing(true);
    
    // Simulate API call for connecting data sources
    setTimeout(() => {
      // Update user data with selected sources (for demo purposes)
      const updatedUserData = {
        ...userData,
        dataSources: selectedSources,
        onboardingComplete: true
      };
      
      localStorage.setItem('cco_user', JSON.stringify(updatedUserData));
      
      // Simulate completion
      setIsProcessing(false);
      router.push('/dashboard'); // Redirect to dashboard (would need to be created)
    }, 2000);
  };

  const handleSkip = () => {
    // Create empty second brain without data sources
    const updatedUserData = {
      ...userData,
      dataSources: [],
      onboardingComplete: true
    };
    
    localStorage.setItem('cco_user', JSON.stringify(updatedUserData));
    router.push('/dashboard'); // Redirect to dashboard
  };

  const dataSources = [
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
          {currentStep === 1 ? (
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-midnight-blue dark:text-cosmic-latte mb-4">
                Create Your Second Brain
              </h1>
              <p className="text-xl text-cosmic-grey dark:text-stardust max-w-2xl mx-auto">
                Import your data from various platforms to build a personalized knowledge base that will power your CCO experience.
              </p>
            </div>
          ) : (
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-midnight-blue dark:text-cosmic-latte mb-4">
                Connect Your Data Sources
              </h1>
              <p className="text-xl text-cosmic-grey dark:text-stardust max-w-2xl mx-auto">
                Select the platforms you'd like to connect to build your second brain knowledge base.
              </p>
            </div>
          )}
          
          {currentStep === 1 ? (
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
                        onClick={handleContinue}
                        className="w-full bg-electric-indigo hover:bg-opacity-90 text-nebula-white text-center px-4 py-3 rounded-md font-medium transition-all"
                      >
                        Connect Data Sources
                      </button>
                      
                      <button
                        onClick={handleSkip}
                        className="w-full border border-cosmic-grey dark:border-stardust border-opacity-30 dark:border-opacity-30 text-cosmic-grey dark:text-stardust hover:text-electric-indigo dark:hover:text-electric-indigo hover:border-electric-indigo dark:hover:border-electric-indigo text-center px-4 py-3 rounded-md font-medium transition-all"
                      >
                        Skip & Create Empty Second Brain
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataSources.map((source) => (
                  <div 
                    key={source.id}
                    onClick={() => toggleSource(source.id)}
                    className={`p-6 rounded-lg border transition-all cursor-pointer flex items-center space-x-4 ${
                      selectedSources.includes(source.id)
                        ? 'border-electric-indigo bg-electric-indigo bg-opacity-5 dark:bg-opacity-10'
                        : 'border-cosmic-grey dark:border-stardust border-opacity-20 dark:border-opacity-20 hover:border-electric-indigo'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {source.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-midnight-blue dark:text-cosmic-latte">{source.name}</h3>
                      <p className="text-sm text-cosmic-grey dark:text-stardust">{source.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        selectedSources.includes(source.id)
                          ? 'bg-electric-indigo text-nebula-white'
                          : 'border border-cosmic-grey dark:border-stardust border-opacity-50 dark:border-opacity-50'
                      }`}>
                        {selectedSources.includes(source.id) && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col-reverse md:flex-row gap-4 justify-end pt-6">
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 text-cosmic-grey dark:text-stardust hover:text-electric-indigo dark:hover:text-electric-indigo transition-colors"
                >
                  Skip for now
                </button>
                
                <button
                  onClick={handleSourceConnect}
                  disabled={isProcessing || selectedSources.length === 0}
                  className={`bg-electric-indigo hover:bg-opacity-90 text-nebula-white px-8 py-3 rounded-md font-medium transition-all ${
                    (isProcessing || selectedSources.length === 0) ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </span>
                  ) : 'Connect Selected Sources'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage; 