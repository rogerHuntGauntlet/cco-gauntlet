import React from 'react';
import type { FC } from 'react';

interface DataSource {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
}

interface Preferences {
  notificationFrequency: string;
  dataPrivacy: string;
  aiSuggestions: boolean;
}

interface ConfirmationStepProps {
  selectedSources: string[];
  dataSources: DataSource[];
  preferences: Preferences;
  userProject?: string;
  onFinish: () => void;
  onBack: () => void;
  isProcessing: boolean;
}

const ConfirmationStep: FC<ConfirmationStepProps> = ({
  selectedSources,
  dataSources,
  preferences,
  userProject,
  onFinish,
  onBack,
  isProcessing
}) => {
  return (
    <div className="bg-nebula-white dark:bg-cosmic-grey dark:bg-opacity-20 rounded-xl p-8 md:p-12 shadow-lg">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto bg-electric-indigo bg-opacity-10 dark:bg-opacity-20 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-electric-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-midnight-blue dark:text-cosmic-latte mb-2">
          You're all set!
        </h2>
        <p className="text-cosmic-grey dark:text-stardust">
          Your Second Brain is ready to be created with the following configuration:
        </p>
      </div>
      
      <div className="space-y-6 mb-8">
        {/* User Project Information */}
        {userProject && (
          <div>
            <h3 className="font-medium text-lg text-midnight-blue dark:text-cosmic-latte mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-electric-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Your First Project
            </h3>
            <div className="p-4 rounded-lg border border-cosmic-grey dark:border-stardust border-opacity-20 dark:border-opacity-20">
              <p className="text-cosmic-grey dark:text-stardust">{userProject}</p>
            </div>
          </div>
        )}
      
        {/* Connected Data Sources */}
        <div>
          <h3 className="font-medium text-lg text-midnight-blue dark:text-cosmic-latte mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-electric-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Connected Data Sources
          </h3>
          
          {selectedSources.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedSources.map(sourceId => {
                const source = dataSources.find(s => s.id === sourceId);
                return (
                  <div key={sourceId} className="inline-flex items-center bg-electric-indigo bg-opacity-10 dark:bg-opacity-20 text-electric-indigo px-3 py-1 rounded-full text-sm">
                    {source?.name}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-cosmic-grey dark:text-stardust">No data sources selected (Empty Second Brain)</p>
          )}
        </div>
        
        {/* Preferences */}
        <div>
          <h3 className="font-medium text-lg text-midnight-blue dark:text-cosmic-latte mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-electric-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Your Preferences
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-cosmic-grey dark:border-stardust border-opacity-20 dark:border-opacity-20">
              <h4 className="font-medium text-midnight-blue dark:text-cosmic-latte mb-1">Notification Frequency</h4>
              <p className="text-sm text-cosmic-grey dark:text-stardust capitalize">{preferences.notificationFrequency}</p>
            </div>
            
            <div className="p-4 rounded-lg border border-cosmic-grey dark:border-stardust border-opacity-20 dark:border-opacity-20">
              <h4 className="font-medium text-midnight-blue dark:text-cosmic-latte mb-1">Data Privacy</h4>
              <p className="text-sm text-cosmic-grey dark:text-stardust capitalize">{preferences.dataPrivacy}</p>
            </div>
            
            <div className="p-4 rounded-lg border border-cosmic-grey dark:border-stardust border-opacity-20 dark:border-opacity-20">
              <h4 className="font-medium text-midnight-blue dark:text-cosmic-latte mb-1">AI Suggestions</h4>
              <p className="text-sm text-cosmic-grey dark:text-stardust">{preferences.aiSuggestions ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col-reverse md:flex-row gap-4 justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 text-cosmic-grey dark:text-stardust hover:text-electric-indigo dark:hover:text-electric-indigo transition-colors"
        >
          Back
        </button>
        
        <button
          onClick={onFinish}
          disabled={isProcessing}
          className={`bg-electric-indigo hover:bg-opacity-90 text-nebula-white px-8 py-3 rounded-md font-medium transition-all ${
            isProcessing ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Your Second Brain...
            </span>
          ) : 'Create My Second Brain'}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationStep; 