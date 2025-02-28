// Import React
import React from 'react';

// Fix for "File is not a module" error
declare module '@heroicons/react/24/outline';
declare module 'date-fns';

// Add global JSX namespace
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
} 