import React from 'react';
import type { FC } from 'react';

interface DataSource {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
}

interface DataSourcesStepProps {
  dataSources: DataSource[];
  selectedSources: string[];
  toggleSource: (sourceId: string) => void;
  onContinue: () => void;
  onBack: () => void;
  onSkip: () => void;
  isProcessing: boolean;
}

const DataSourcesStep: FC<DataSourcesStepProps> = ({
  dataSources,
  selectedSources,
  toggleSource,
  onContinue,
  onBack,
  onSkip,
  isProcessing
}) => {
  return (
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
      
      <div className="flex flex-col-reverse md:flex-row gap-4 justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 text-cosmic-grey dark:text-stardust hover:text-electric-indigo dark:hover:text-electric-indigo transition-colors"
        >
          Back
        </button>

        <div className="flex flex-col-reverse md:flex-row gap-4">
          <button
            onClick={onSkip}
            className="px-6 py-3 text-cosmic-grey dark:text-stardust hover:text-electric-indigo dark:hover:text-electric-indigo transition-colors"
          >
            Skip for now
          </button>
          
          <button
            onClick={onContinue}
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
            ) : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSourcesStep; 