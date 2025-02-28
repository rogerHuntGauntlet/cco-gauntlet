import React from 'react';
import type { FC } from 'react';

interface Preferences {
  notificationFrequency: string;
  dataPrivacy: string;
  aiSuggestions: boolean;
}

interface CustomizeStepProps {
  preferences: Preferences;
  setPreferences: (preferences: Preferences) => void;
  onContinue: () => void;
  onBack: () => void;
}

const CustomizeStep: FC<CustomizeStepProps> = ({ 
  preferences, 
  setPreferences, 
  onContinue, 
  onBack 
}) => {
  const updatePreference = (key: keyof Preferences, value: any) => {
    setPreferences({ ...preferences, [key]: value });
  };

  return (
    <div className="bg-nebula-white dark:bg-cosmic-grey dark:bg-opacity-20 rounded-xl p-8 md:p-12 shadow-lg">
      <h2 className="text-2xl font-semibold text-midnight-blue dark:text-cosmic-latte mb-6">
        Customize Your Second Brain
      </h2>
      
      <div className="space-y-8">
        {/* Notification Frequency */}
        <div>
          <h3 className="font-medium text-lg text-midnight-blue dark:text-cosmic-latte mb-3">Notification Frequency</h3>
          <p className="text-cosmic-grey dark:text-stardust mb-4">How often would you like to receive updates about your Second Brain?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['daily', 'weekly', 'monthly'].map(frequency => (
              <div 
                key={frequency}
                onClick={() => updatePreference('notificationFrequency', frequency)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  preferences.notificationFrequency === frequency
                    ? 'border-electric-indigo bg-electric-indigo bg-opacity-5 dark:bg-opacity-10'
                    : 'border-cosmic-grey dark:border-stardust border-opacity-20 dark:border-opacity-20 hover:border-electric-indigo'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-midnight-blue dark:text-cosmic-latte capitalize">
                    {frequency}
                  </h4>
                  {preferences.notificationFrequency === frequency && (
                    <div className="w-5 h-5 rounded-full bg-electric-indigo text-nebula-white flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm text-cosmic-grey dark:text-stardust">
                  {frequency === 'daily' ? 'Get updates every day' : 
                   frequency === 'weekly' ? 'Get a weekly summary' : 
                   'Receive a monthly digest'}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Data Privacy */}
        <div>
          <h3 className="font-medium text-lg text-midnight-blue dark:text-cosmic-latte mb-3">Data Privacy</h3>
          <p className="text-cosmic-grey dark:text-stardust mb-4">Choose how your data is shared within the platform</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { 
                id: 'private', 
                title: 'Private', 
                description: 'Your data is only used for your personal assistant'
              },
              { 
                id: 'discoverable', 
                title: 'Discoverable', 
                description: 'Allow clients to discover your profile based on expertise'
              }
            ].map(option => (
              <div 
                key={option.id}
                onClick={() => updatePreference('dataPrivacy', option.id)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  preferences.dataPrivacy === option.id
                    ? 'border-electric-indigo bg-electric-indigo bg-opacity-5 dark:bg-opacity-10'
                    : 'border-cosmic-grey dark:border-stardust border-opacity-20 dark:border-opacity-20 hover:border-electric-indigo'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-midnight-blue dark:text-cosmic-latte">
                    {option.title}
                  </h4>
                  {preferences.dataPrivacy === option.id && (
                    <div className="w-5 h-5 rounded-full bg-electric-indigo text-nebula-white flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm text-cosmic-grey dark:text-stardust">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* AI Suggestions */}
        <div className="pb-4">
          <h3 className="font-medium text-lg text-midnight-blue dark:text-cosmic-latte mb-3">AI-Powered Features</h3>
          <div className="flex items-center justify-between p-4 rounded-lg border border-cosmic-grey dark:border-stardust border-opacity-20 dark:border-opacity-20">
            <div>
              <h4 className="font-medium text-midnight-blue dark:text-cosmic-latte mb-1">Enable AI Suggestions</h4>
              <p className="text-sm text-cosmic-grey dark:text-stardust">Allow AI to provide personalized recommendations based on your data</p>
            </div>
            <div 
              onClick={() => updatePreference('aiSuggestions', !preferences.aiSuggestions)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.aiSuggestions ? 'bg-electric-indigo' : 'bg-cosmic-grey dark:bg-stardust bg-opacity-30 dark:bg-opacity-30'
              }`}
            >
              <span 
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.aiSuggestions ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
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
          onClick={onContinue}
          className="bg-electric-indigo hover:bg-opacity-90 text-nebula-white px-8 py-3 rounded-md font-medium transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CustomizeStep; 