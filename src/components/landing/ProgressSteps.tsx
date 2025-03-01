import React from 'react';
import type { FC } from 'react';

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

const ProgressSteps: FC<ProgressStepsProps> = ({ 
  currentStep, 
  totalSteps,
  stepLabels = ['Introduction', 'Data Sources', 'Customize', 'Finish']
}) => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div 
                className={`flex-1 h-1 mx-2 ${
                  index < currentStep ? 'bg-electric-indigo' : 'bg-cosmic-grey dark:bg-stardust bg-opacity-30 dark:bg-opacity-30'
                }`}
              ></div>
            )}
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < currentStep 
                  ? 'bg-electric-indigo text-nebula-white' 
                  : index === currentStep
                  ? 'border-2 border-electric-indigo text-electric-indigo'
                  : 'border border-cosmic-grey dark:border-stardust border-opacity-50 dark:border-opacity-50 text-cosmic-grey dark:text-stardust'
              }`}
            >
              {index + 1}
            </div>
          </React.Fragment>
        ))}
      </div>
      {stepLabels && (
        <div className="flex justify-between max-w-md mx-auto mt-2 text-xs text-cosmic-grey dark:text-stardust">
          {stepLabels.slice(0, totalSteps).map((label, index) => (
            <div key={index} className="text-center">{label}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressSteps; 