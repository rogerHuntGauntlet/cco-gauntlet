import React, { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';

interface VoiceInteractionStepProps {
  onContinue: () => void;
  onSkip: () => void;
}

const VoiceInteractionStep: FC<VoiceInteractionStepProps> = ({ onContinue, onSkip }) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [hasSpoken, setHasSpoken] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBrowser, setIsBrowser] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  
  // Check if we're in the browser environment
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  // Initialize speech recognition
  useEffect(() => {
    if (!isBrowser) return;
    
    // Now it's safe to access window
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcriptArray = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        setTranscript(transcriptArray);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isBrowser]);
  
  // Function to play text-to-speech using Eleven Labs
  const playVoicePrompt = async () => {
    if (!isBrowser) return;
    
    setIsLoading(true);
    try {
      // This is a placeholder for actual Eleven Labs API call
      // You would replace this with an actual API call to Eleven Labs
      
      // Simulated API response
      setTimeout(() => {
        // Create a new audio element with the sample audio
        if (audioRef.current) {
          audioRef.current.src = '/assets/audio/sample-prompt.mp3'; // Replace with your actual audio file or API response
          audioRef.current.play().then(() => {
            setHasSpoken(true);
            setIsLoading(false);
          });
        }
      }, 1000);
      
      // For real implementation with Eleven Labs, you'd do something like:
      /*
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/voice-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': 'your-api-key'
        },
        body: JSON.stringify({
          text: 'Tell me about your first project',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setHasSpoken(true);
      }
      */
    } catch (error) {
      console.error('Error playing voice prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to toggle speech recognition
  const toggleListening = () => {
    if (!isBrowser || !recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };
  
  return (
    <div className="bg-nebula-white dark:bg-cosmic-grey dark:bg-opacity-20 rounded-xl p-8 md:p-12 shadow-lg">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto bg-electric-indigo bg-opacity-10 dark:bg-opacity-20 rounded-full flex items-center justify-center mb-4">
          <svg 
            className="w-10 h-10 text-electric-indigo" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-semibold text-midnight-blue dark:text-cosmic-latte mb-2">
          Let&apos;s Get To Know You
        </h2>
        
        <p className="text-cosmic-grey dark:text-stardust mb-6">
          Before creating your Second Brain, I&apos;d like to understand what you&apos;re working on.
        </p>
        
        {/* Hidden audio element for playing TTS */}
        <audio ref={audioRef} onEnded={() => isBrowser && setIsListening(true)} />
      </div>
      
      <div className="mb-8">
        <div className="p-4 rounded-lg bg-electric-indigo bg-opacity-5 dark:bg-opacity-10 border border-electric-indigo border-opacity-20 mb-6">
          <h3 className="font-medium text-lg text-electric-indigo mb-2">
            Tell me about your first project
          </h3>
          
          {!hasSpoken ? (
            <div className="flex justify-center">
              <button
                onClick={playVoicePrompt}
                disabled={isLoading}
                className={`flex items-center justify-center px-6 py-3 rounded-md bg-electric-indigo text-nebula-white font-medium transition-all ${
                  isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-opacity-90'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Voice...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Hear Voice Prompt
                  </>
                )}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-center mb-4">
                <button
                  onClick={toggleListening}
                  className={`flex items-center justify-center px-6 py-3 rounded-md transition-all ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-electric-indigo hover:bg-opacity-90 text-nebula-white'
                  } font-medium`}
                >
                  {isListening ? (
                    <>
                      <svg className="w-5 h-5 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      Start Recording
                    </>
                  )}
                </button>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                isListening 
                  ? 'border-electric-indigo bg-electric-indigo bg-opacity-5 dark:bg-opacity-10' 
                  : 'border-cosmic-grey dark:border-stardust border-opacity-20 dark:border-opacity-20'
              }`}>
                <p className="text-cosmic-grey dark:text-stardust min-h-[100px] whitespace-pre-wrap">
                  {transcript || (isListening ? 'Listening...' : 'Click "Start Recording" to tell me about your first project.')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col-reverse md:flex-row gap-4 justify-between">
        <button
          onClick={onSkip}
          className="px-6 py-3 text-cosmic-grey dark:text-stardust hover:text-electric-indigo dark:hover:text-electric-indigo transition-colors"
        >
          Skip This Step
        </button>
        
        <button
          onClick={onContinue}
          disabled={!transcript && hasSpoken}
          className={`bg-electric-indigo hover:bg-opacity-90 text-nebula-white px-8 py-3 rounded-md font-medium transition-all ${
            !transcript && hasSpoken ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          Continue to Second Brain Setup
        </button>
      </div>
    </div>
  );
};

export default VoiceInteractionStep; 