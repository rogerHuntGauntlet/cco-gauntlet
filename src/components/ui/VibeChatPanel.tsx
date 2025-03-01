import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { callBedrockAI, BEDROCK_MODELS, BedrockRequestOptions } from '../../utils/bedrockAI';

interface Message {
  id: string;
  sender: 'user' | 'vibe';
  text: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface VibeChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VibeChatPanel({ isOpen, onClose }: VibeChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'vibe',
      text: 'Hi there! I&apos;m your VIBE assistant. How can I enhance your flow state today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [panelWidth, setPanelWidth] = useState(384); // Default width of 96 in rem (384px)
  const [isResizing, setIsResizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<string>('Ready to assist');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      // Calculate new width (distance from right edge of screen to cursor)
      const newWidth = window.innerWidth - e.clientX;
      
      // Set minimum and maximum widths
      if (newWidth >= 280 && newWidth <= 1200) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };
    
    // Create a placeholder for the VIBE response
    const responseId = (Date.now() + 1).toString();
    const loadingMessage: Message = {
      id: responseId,
      sender: 'vibe',
      text: '',
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);
    
    // Define models to try in order of preference
    const modelsToTry = [
      // Only try Titan since we&apos;re not have access to Claude models
      BEDROCK_MODELS.TITAN_TEXT
    ];
    
    let succeeded = false;
    let inferenceProfileError = false;
    
    // Try each model until one succeeds
    for (const modelId of modelsToTry) {
      if (succeeded) break;
      
      try {
        // Format prompt based on model type
        let promptOptions: BedrockRequestOptions;
        
        if (modelId === BEDROCK_MODELS.CLAUDE_SONNET_3_7) {
          // Claude 3.7 Sonnet with extended thinking capabilities
          promptOptions = {
            prompt: [{ 
              type: 'text', 
              text: `You are VIBE, an AI assistant designed to help users achieve and maintain flow state in their work. 
              The user is asking: ${inputValue}
              
              Use your extended thinking capabilities to provide a thoughtful, personalized response focused on flow state, productivity, and work optimization. Consider factors like attention management, cognitive load, environment design, and psychological aspects of deep work.`
            }],
            modelId: modelId,
            maxTokens: 800,
            temperature: 0.7,
            topK: 250,
            topP: 0.999
          };
        } else if (modelId.includes('claude')) {
          // Other Claude models use standard format
          promptOptions = {
            prompt: [{ 
              type: 'text', 
              text: `You are VIBE, an AI assistant designed to help users achieve and maintain flow state in their work. 
              The user is asking: ${inputValue}
              Provide a helpful response focused on flow state, productivity, and work optimization.`
            }],
            modelId: modelId,
            maxTokens: 500,
            temperature: 0.7,
            topK: 250,
            topP: 0.999
          };
        } else {
          // Titan and other models use simple text format
          promptOptions = {
            prompt: `You are VIBE, an AI assistant designed to help users achieve and maintain flow state in their work. 
            The user is asking: ${inputValue}
            Provide a helpful response focused on flow state, productivity, and work optimization.`,
            modelId: modelId,
            maxTokens: 500,
            temperature: 0.7,
            topK: 250,
            topP: 0.999
          };
        }
        
        // Call Amazon Bedrock API through our utility function
        const response = await callBedrockAI(promptOptions);
        
        // Update the message with the actual response
        if (response.error) {
          console.log(`Error with model ${modelId}:`, response.error);
          
          // If this is Claude 3.7 Sonnet and we have an inference profile error
          if (modelId === BEDROCK_MODELS.CLAUDE_SONNET_3_7 && 
              (response.error.includes('inference profile') || 
               response.error.includes('on-demand throughput isn&apos;t supported'))) {
            
            console.log('Claude 3.7 Sonnet requires an inference profile, trying other models...');
            inferenceProfileError = true;
            // Just continue to the next model without showing an error to the user
          } else {
            // For other errors, continue to the next model
          }
        } else {
          // Update the loading message with the actual response
          setMessages(prev => 
            prev.map(msg => 
              msg.id === responseId 
                ? { 
                    ...msg, 
                    text: response.result || "I couldn&apos;t generate a response. Please try again.", 
                    isLoading: false 
                  }
                : msg
            )
          );
          succeeded = true;
          setAiStatus(`Connected to Amazon Bedrock (Titan Text model)`);
          break;
        }
      } catch (err) {
        console.error(`Error calling Bedrock with model ${modelId}:`, err);
        // Continue to the next model
      }
    }
    
    // If all models failed, provide a more intelligent fallback response
    if (!succeeded) {
      // Create more contextual fallback responses based on keywords in the user&apos;s message
      let responseText = "";
      const inputLower = inputValue.toLowerCase();
      
      if (inputLower.includes("distract") || inputLower.includes("focus") || inputLower.includes("attention")) {
        responseText = "To minimize distractions and improve focus, I recommend the following: (1) Use dedicated focus apps that block distracting websites and notifications, (2) Implement the '2-minute rule' - if a task takes less than 2 minutes, do it immediately rather than letting it distract you later, (3) Create a physical environment that signals 'focus time' to your brain, and (4) Practice mindful transitions between tasks to maintain your focus momentum.";
      } 
      else if (inputLower.includes("flow") || inputLower.includes("zone")) {
        responseText = "Flow state occurs when you&apos;re completely immersed in an activity that balances challenge and skill. To enter flow more reliably: (1) Eliminate external interruptions by silencing notifications and creating a dedicated workspace, (2) Set clear, challenging but achievable goals for each session, (3) Establish a pre-flow ritual that signals to your brain it&apos;s time to focus deeply, and (4) Match your most challenging work to your peak energy periods during the day.";
      }
      else if (inputLower.includes("procrastinat") || inputLower.includes("stuck") || inputLower.includes("motiv")) {
        responseText = "To overcome procrastination and boost motivation: (1) Break down intimidating tasks into smaller, more manageable steps, (2) Use time-blocking to dedicate specific periods to challenging work, (3) Implement the '5-minute rule' by committing to just start working for 5 minutes, which often leads to continued progress, and (4) Create accountability systems through deadlines, commitment devices, or work partners.";
      }
      else if (inputLower.includes("burnout") || inputLower.includes("stress") || inputLower.includes("overwhelm")) {
        responseText = "Managing burnout and stress is essential for sustainable productivity. I recommend: (1) Implementing strict work boundaries with dedicated recovery periods, (2) Practicing strategic work detachment during breaks, (3) Prioritizing sleep quality and physical movement, and (4) Using stress-monitoring techniques to identify early warning signs before burnout occurs.";
      }
      else if (inputLower.includes("time") || inputLower.includes("schedul") || inputLower.includes("plan")) {
        responseText = "For better time management and planning: (1) Use time-blocking rather than simple to-do lists, (2) Implement the Eisenhower Matrix to prioritize tasks based on importance and urgency, (3) Protect your calendar from low-value commitments with strategic scheduling buffers, and (4) Plan your weeks in advance but allow flexibility for adjustments as priorities change.";
      }
      else {
        // Generic responses for other topics
        const fallbackResponses = [
          "To enhance your flow state, I recommend establishing a consistent environment that triggers your focus. This includes having a dedicated workspace, familiar tools, and sensory cues (like specific music or ambient sounds) that signal to your brain it&apos;s time for deep work.",
          "One effective technique for maintaining flow is the Pomodoro method with personalized timing. While traditional Pomodoros are 25 minutes, flow research suggests that your optimal deep work interval may be longer - between 50-90 minutes for most people. Experiment to find your ideal cycle.",
          "Preparation is crucial for achieving flow. Before starting your work sessions, take 10 minutes to clear potential distractions: silence notifications, prepare needed resources, set clear mini-goals for the session, and briefly review what you accomplished previously to provide mental continuity.",
          "The transition between tasks is where flow is often lost. I recommend creating a brief transition ritual between different types of work that includes: noting where you left off, identifying what you accomplished, clearing your workspace (physically or digitally), and setting an intention for the next task.",
          "Energy management is as important as time management for maintaining flow. Track your energy patterns throughout the day and schedule your most demanding, focus-intensive work during your peak cognitive periods. Reserve administrative or routine tasks for energy valleys."
        ];
        
        responseText = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      }
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === responseId 
            ? { 
                ...msg, 
                text: responseText + "\n\n(Note: This response is provided by the system&apos;s built-in knowledge base rather than a live AI model.)", 
                isLoading: false 
              }
            : msg
        )
      );
      
      // Set a more helpful error message
      if (inferenceProfileError) {
        setError("Claude models require special access in AWS Bedrock. Using built-in responses.");
      } else {
        setError("Unable to access Amazon Bedrock models. Using built-in responses.");
      }
      
      setAiStatus('Using built-in knowledge base (Amazon Bedrock unavailable)');
    }
    
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-y-0 right-0 bg-white shadow-xl z-50 flex flex-col border-l border-cco-neutral-200 transition-transform duration-300 ease-in-out transform translate-x-0 animate-slide-in"
      style={{ width: `${panelWidth}px` }}
    >
      {/* Resize handle */}
      <div 
        ref={resizeRef}
        className="absolute inset-y-0 left-0 w-1 bg-transparent hover:bg-cco-primary-300 cursor-ew-resize group"
        onMouseDown={startResizing}
      >
        <div className="absolute inset-y-0 left-0 w-1 bg-cco-primary-400 opacity-0 group-hover:opacity-50"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cco-neutral-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cco-primary-500 to-cco-accent-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
              <path d="M12 12L2 12" />
              <path d="M12 12l4.3-4.3" />
              <path d="M12 12l4.3 4.3" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-cco-neutral-900">VIBE Assistant</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-md text-cco-neutral-700 hover:bg-cco-neutral-100"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cco-neutral-50">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'user' 
                  ? 'bg-cco-primary-500 text-white' 
                  : 'bg-white border border-cco-neutral-200 text-cco-neutral-900'
              }`}
            >
              {message.isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cco-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-cco-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-cco-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              ) : (
                <p>{message.text}</p>
              )}
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-cco-primary-200' : 'text-cco-neutral-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSendMessage} className="border-t border-cco-neutral-200 p-4">
        {error && (
          <div className="mb-2 text-xs text-red-500">
            {error}
          </div>
        )}
        <div className="text-xs text-cco-neutral-500 mb-2">
          <p className="mb-1">Note: Full AI capabilities require AWS Bedrock access to Claude models.</p>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${error ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span>{aiStatus}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Message VIBE assistant..."
            className="flex-1 px-4 py-2 rounded-md border border-cco-neutral-300 focus:outline-none focus:ring-2 focus:ring-cco-primary-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`p-2 rounded-md ${
              inputValue.trim() && !isLoading
                ? 'bg-cco-primary-500 text-white hover:bg-cco-primary-600' 
                : 'bg-cco-neutral-200 text-cco-neutral-500'
            }`}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
} 