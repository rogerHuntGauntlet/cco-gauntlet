import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  RectangleStackIcon, 
  ClockIcon,
  UsersIcon,
  TagIcon,
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  ChatBubbleLeftEllipsisIcon,
  BoltIcon,
  SunIcon,
  MoonIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  XMarkIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

// Define project types (same as in the dashboard)
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'planning';
  startDate: string;
  dueDate?: string;
  completedDate?: string;
  progress: number;
  teamMembers: TeamMember[];
  tags: string[];
  clientName?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

// Mock data for projects (same as in the dashboard)
const mockTeamMembers: TeamMember[] = [
  { id: 'u1', name: 'Alex Johnson', role: 'Project Manager', avatar: 'https://i.pravatar.cc/150?img=68' },
  { id: 'u2', name: 'Sarah Williams', role: 'Designer', avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: 'u3', name: 'Michael Chen', role: 'Developer', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: 'u4', name: 'Emily Davis', role: 'Content Writer', avatar: 'https://i.pravatar.cc/150?img=23' },
  { id: 'u5', name: 'James Wilson', role: 'QA Engineer', avatar: 'https://i.pravatar.cc/150?img=59' }
];

const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Modernize the company website with new branding and improved UX.',
    status: 'active',
    startDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 35,
    teamMembers: [mockTeamMembers[0], mockTeamMembers[1], mockTeamMembers[2]],
    tags: ['design', 'development', 'branding'],
    clientName: 'Acme Corp',
    priority: 'high'
  },
  {
    id: 'p2',
    name: 'Mobile App Development',
    description: 'Create a native mobile app for iOS and Android platforms.',
    status: 'planning',
    startDate: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(new Date().getTime() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 10,
    teamMembers: [mockTeamMembers[0], mockTeamMembers[2], mockTeamMembers[4]],
    tags: ['mobile', 'development', 'app'],
    clientName: 'TechStart Inc',
    priority: 'medium'
  },
  {
    id: 'p3',
    name: 'Content Marketing Campaign',
    description: 'Develop and execute a comprehensive content marketing strategy.',
    status: 'active',
    startDate: new Date(new Date().getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 65,
    teamMembers: [mockTeamMembers[0], mockTeamMembers[3]],
    tags: ['marketing', 'content', 'social'],
    clientName: 'Global Retail',
    priority: 'high'
  },
  {
    id: 'p4',
    name: 'E-commerce Platform Integration',
    description: 'Integrate payment gateways and shipping providers with the e-commerce platform.',
    status: 'on-hold',
    startDate: new Date(new Date().getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 40,
    teamMembers: [mockTeamMembers[0], mockTeamMembers[2], mockTeamMembers[4]],
    tags: ['e-commerce', 'integration', 'development'],
    clientName: 'ShopNow Ltd',
    priority: 'medium'
  },
  {
    id: 'p5',
    name: 'Annual Report Design',
    description: 'Design and layout the company\'s annual financial and impact report.',
    status: 'completed',
    startDate: new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 100,
    teamMembers: [mockTeamMembers[1], mockTeamMembers[3]],
    tags: ['design', 'report', 'finance'],
    clientName: 'Internal',
    priority: 'low'
  }
];

// Mock project documents
interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  lastUpdated: string;
  url: string;
}

const mockDocuments: { [key: string]: ProjectDocument[] } = {
  'p1': [
    { id: 'd1', name: 'Website Requirements', type: 'PDF', lastUpdated: '2023-06-15', url: '#' },
    { id: 'd2', name: 'Brand Guidelines', type: 'PDF', lastUpdated: '2023-06-10', url: '#' },
    { id: 'd3', name: 'Wireframes', type: 'Figma', lastUpdated: '2023-06-22', url: '#' },
    { id: 'd4', name: 'Development Roadmap', type: 'Doc', lastUpdated: '2023-06-25', url: '#' },
  ],
  'p2': [
    { id: 'd5', name: 'App Requirements', type: 'PDF', lastUpdated: '2023-07-05', url: '#' },
    { id: 'd6', name: 'User Stories', type: 'Doc', lastUpdated: '2023-07-10', url: '#' },
    { id: 'd7', name: 'API Documentation', type: 'Doc', lastUpdated: '2023-07-15', url: '#' },
  ],
  'p3': [
    { id: 'd8', name: 'Content Strategy', type: 'PDF', lastUpdated: '2023-05-12', url: '#' },
    { id: 'd9', name: 'Campaign Calendar', type: 'Sheet', lastUpdated: '2023-05-20', url: '#' },
    { id: 'd10', name: 'Analytics Report', type: 'PDF', lastUpdated: '2023-06-01', url: '#' },
  ],
  'p4': [
    { id: 'd11', name: 'Integration Requirements', type: 'PDF', lastUpdated: '2023-04-18', url: '#' },
    { id: 'd12', name: 'API Keys', type: 'Doc', lastUpdated: '2023-04-25', url: '#' },
    { id: 'd13', name: 'Testing Plan', type: 'Doc', lastUpdated: '2023-05-02', url: '#' },
  ],
  'p5': [
    { id: 'd14', name: 'Annual Report Draft', type: 'PDF', lastUpdated: '2023-03-10', url: '#' },
    { id: 'd15', name: 'Financial Data', type: 'Sheet', lastUpdated: '2023-03-05', url: '#' },
    { id: 'd16', name: 'Executive Summary', type: 'Doc', lastUpdated: '2023-03-15', url: '#' },
  ],
};

// Chat message interface
interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

// Document type icons
const documentTypeIcons: Record<string, React.ReactNode> = {
  'PDF': <div className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-800 rounded-md">PDF</div>,
  'Doc': <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 rounded-md">DOC</div>,
  'Figma': <div className="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-800 rounded-md">FIG</div>,
  'Sheet': <div className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-800 rounded-md">XLS</div>,
};

const SharedProjectPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'documents' | 'chat'>('chat');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // AI interaction states
  const [showAIModal, setShowAIModal] = useState(false);
  const [isVoiceOutputActive, setIsVoiceOutputActive] = useState(false);
  const [avatarSpeaking, setAvatarSpeaking] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState('');
  const [isVoiceInputMode, setIsVoiceInputMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const avatarTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load project data
  useEffect(() => {
    if (id) {
      const projectId = Array.isArray(id) ? id[0] : id;
      const foundProject = mockProjects.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
        setDocuments(mockDocuments[projectId] || []);
        
        // Add initial AI greeting message
        setChatMessages([
          {
            id: 'initial',
            sender: 'ai',
            content: `Hey there! I'm your VIBE assistant for the "${foundProject.name}" project. Ask me anything about this project and let's collaborate!`,
            timestamp: new Date()
          }
        ]);
      }
    }
  }, [id]);

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('cco-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
  }, []);

  // Update localStorage and document class when theme changes
  useEffect(() => {
    localStorage.setItem('cco-theme', theme);
    
    // Apply theme to document body
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(current => current === 'dark' ? 'light' : 'dark');
  };
  
  const toggleAIModal = () => {
    const willOpen = !showAIModal;
    setShowAIModal(willOpen);
    
    // If opening the modal, start the avatar greeting
    if (willOpen) {
      initiateAvatarGreeting();
    } else {
      // Clear any pending timeouts when closing
      if (avatarTimeoutRef.current) {
        clearTimeout(avatarTimeoutRef.current);
        avatarTimeoutRef.current = null;
      }
    }
  };
  
  const initiateAvatarGreeting = () => {
    setAvatarSpeaking(true);
    setAvatarMessage('');
    
    // Simulate typing effect for the greeting
    const greeting = project ? 
      `Hello! I'm your VIBE AI assistant for the ${project.name} project. How can I help you today?` : 
      'Hello! I\'m your VIBE AI assistant. How can I help you today?';
    
    let index = 0;
    const interval = 50; // milliseconds per character
    
    const typeMessage = () => {
      if (index < greeting.length) {
        setAvatarMessage(prev => prev + greeting.charAt(index));
        index++;
        avatarTimeoutRef.current = setTimeout(typeMessage, interval);
      } else {
        // Finished typing
        avatarTimeoutRef.current = setTimeout(() => {
          setAvatarSpeaking(false);
        }, 1000);
      }
    };
    
    // Start typing after a brief delay
    avatarTimeoutRef.current = setTimeout(typeMessage, 500);
  };
  
  const toggleVoiceOutput = () => {
    setIsVoiceOutputActive(prev => !prev);
  };
  
  const toggleVoiceInputMode = () => {
    setIsVoiceInputMode(prev => !prev);
    if (isRecording) {
      stopRecording();
    }
  };
  
  const startRecording = () => {
    setIsRecording(true);
    
    // Simulate recording for 3 seconds then automatically stop
    recordingTimeoutRef.current = setTimeout(() => {
      stopRecording();
    }, 3000);
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    
    // Simulate transcribing voice to text instead of sending directly
    setMessageInput(prev => prev + "This is simulated voice-to-text transcription. ");
  };
  
  const handleSendMessage = (input = messageInput, fromModal = false) => {
    if (!input.trim() || !project) return;
    
    // Add user message
    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newUserMessage]);
    if (!fromModal) setMessageInput('');
    setIsLoading(true);
    
    // If the modal is open, close it after sending the message
    if (showAIModal && fromModal) {
      toggleAIModal();
    }
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: `I'm analyzing your question about "${input.trim()}". This is a simulated response for the ${project.name} project. In a production environment, I would provide detailed information drawn from your project documents and timeline.`,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      
      // Simulate voice output if enabled
      if (isVoiceOutputActive) {
        // In a real app, this would connect to a text-to-speech API
        console.log("Voice output would play:", aiResponse.content);
      }
    }, 1500);
  };
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (avatarTimeoutRef.current) {
          clearTimeout(avatarTimeoutRef.current);
          avatarTimeoutRef.current = null;
        }
        setShowAIModal(false);
      }
    };

    if (showAIModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAIModal]);
  
  // Clean up all timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (avatarTimeoutRef.current) {
        clearTimeout(avatarTimeoutRef.current);
      }
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
    };
  }, []);
  
  if (!project) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-[#121c42]' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-6 rounded-full ${theme === 'dark' ? 'bg-[#6016fc]/20' : 'bg-[#6016fc]/10'} flex items-center justify-center`}>
            <svg className="animate-spin h-8 w-8 text-[#6016fc]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Loading project...</h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-2`}>Please wait while we retrieve the project details.</p>
        </div>
      </div>
    );
  }
  
  const statusColors = {
    'active': 'bg-[#00d4a0] text-white',
    'planning': 'bg-blue-500 text-white',
    'on-hold': 'bg-yellow-500 text-white',
    'completed': 'bg-gray-500 text-white'
  };
  
  const priorityColors = {
    'low': 'bg-blue-500 text-white',
    'medium': 'bg-yellow-500 text-white',
    'high': 'bg-orange-500 text-white',
    'urgent': 'bg-red-500 text-white'
  };
  
  const statusDisplay = project.status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const daysUntilDue = project.dueDate 
    ? Math.round((new Date(project.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  return (
    <>
      <Head>
        <title>{project?.name || 'Loading...'} | Shared Project | CCO VibeCoder</title>
        <meta name="description" content={project?.description} />
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
            
            :root {
              --bg-primary: #121c42;
              --bg-secondary: #1a2548;
              --bg-tertiary: #2a355e;
              --text-primary: #ffffff;
              --text-secondary: #94a3b8;
              --accent-primary: #6016fc;
              --accent-secondary: #7c3aed;
            }
            
            .light-theme {
              --bg-primary: #f3f4f6;
              --bg-secondary: #ffffff;
              --bg-tertiary: #e5e7eb;
              --text-primary: #1f2937;
              --text-secondary: #4b5563;
              --accent-primary: #6016fc;
              --accent-secondary: #7c3aed;
            }
            
            body {
              font-family: 'Inter', sans-serif;
              background-color: var(--bg-primary);
              color: var(--text-primary);
            }
            
            @keyframes pulse-ring {
              0% {
                transform: scale(0.8);
                opacity: 0.8;
              }
              50% {
                transform: scale(1);
                opacity: 0.5;
              }
              100% {
                transform: scale(0.8);
                opacity: 0.8;
              }
            }
            
            .avatar-container {
              transition: height 0.3s ease-in-out, opacity 0.3s ease-in-out;
            }
            
            /* Modal animation */
            .modal-backdrop {
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            
            .modal-backdrop.show {
              opacity: 1;
            }
            
            .modal-content {
              transform: scale(0.95);
              opacity: 0;
              transition: transform 0.3s ease, opacity 0.3s ease;
            }
            
            .modal-content.show {
              transform: scale(1);
              opacity: 1;
            }
            
            /* 3D avatar animations */
            @keyframes avatarFloat {
              0% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(1deg); }
              100% { transform: translateY(0px) rotate(0deg); }
            }
            
            .avatar-3d {
              animation: avatarFloat 6s ease-in-out infinite;
            }
            
            .chat-bubble {
              position: relative;
            }
            
            .chat-bubble:after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 20px;
              width: 20px;
              height: 20px;
              background: var(--accent-primary);
              border-bottom-left-radius: 50%;
              clip-path: polygon(0 0, 100% 0, 100% 100%);
              transform: translateY(50%) rotate(45deg);
            }
            
            .typing-cursor {
              display: inline-block;
              width: 10px;
              height: 20px;
              background-color: white;
              margin-left: 5px;
              animation: blink 1s infinite;
            }
            
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `}
        </style>
      </Head>
      
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#121c42]' : 'bg-gray-100'}`}>
        <header className={`${theme === 'dark' ? 'bg-[#1a2548] border-[#2a355e]' : 'bg-white border-gray-200'} border-b py-4`}>
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-[#6016fc]' : 'bg-[#6016fc]'} rounded-lg flex items-center justify-center mr-3`}>
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  CCO <span className="text-[#6016fc]">VibeCoder</span>
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400 bg-[#2a355e]' : 'text-gray-600 bg-gray-100'} px-3 py-1 rounded-full`}>
                  Shared Project View
                </span>
                <button 
                  onClick={toggleTheme}
                  className={`p-2 rounded-full ${theme === 'dark' 
                    ? 'bg-[#2a355e] text-gray-200 hover:bg-[#354173]' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' 
                    ? <SunIcon className="w-5 h-5" /> 
                    : <MoonIcon className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar with Tabs */}
          <div className={`w-64 ${theme === 'dark' 
            ? 'bg-[#1a2548] border-[#2a355e]' 
            : 'bg-white border-gray-200'
          } border-r flex flex-col`}>
            <div className="p-4">
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-1 line-clamp-2`}>
                {project.name}
              </h2>
              <div className="flex flex-wrap gap-2 my-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                  {statusDisplay}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[project.priority]}`}>
                  {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                </span>
              </div>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4 line-clamp-2`}>
                {project.description}
              </p>
            </div>
            
            {/* Vertical Navigation Tabs */}
            <nav className="flex-1">
              <button 
                className={`w-full text-left px-4 py-3 flex items-center ${
                  activeTab === 'chat' 
                    ? 'bg-[#6016fc] text-white' 
                    : theme === 'dark'
                      ? 'text-gray-400 hover:bg-[#2a355e] hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('chat')}
              >
                <SparklesIcon className="w-5 h-5 mr-3" />
                VIBE
              </button>
              <button 
                className={`w-full text-left px-4 py-3 flex items-center ${
                  activeTab === 'info' 
                    ? theme === 'dark' ? 'bg-[#2a355e] text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:bg-[#2a355e] hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('info')}
              >
                <DocumentTextIcon className="w-5 h-5 mr-3" />
                Project Overview
              </button>
              <button 
                className={`w-full text-left px-4 py-3 flex items-center ${
                  activeTab === 'documents' 
                    ? theme === 'dark' ? 'bg-[#2a355e] text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:bg-[#2a355e] hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('documents')}
              >
                <RectangleStackIcon className="w-5 h-5 mr-3" />
                Documents
              </button>
            </nav>
            
            {/* Project Team Members */}
            <div className={`p-4 border-t ${theme === 'dark' ? 'border-[#2a355e]' : 'border-gray-200'}`}>
              <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Team Members</h3>
              <div className="flex flex-wrap gap-1">
                {project.teamMembers.map(member => (
                  <div key={member.id} className="tooltip" title={`${member.name} - ${member.role}`}>
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className={`w-8 h-8 rounded-full border-2 ${theme === 'dark' ? 'border-[#2a355e]' : 'border-gray-200'}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* VIBE Chat */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col p-6">
                <div className="bg-[#6016fc] p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <SparklesIcon className="w-6 h-6 text-white mr-2" />
                      <div>
                        <h2 className="text-lg font-bold text-white">VIBE with this project</h2>
                        <p className="text-sm text-purple-200">
                          Ask questions about the project documents, timeline, or requirements.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={toggleAIModal}
                        className={`p-2 rounded-lg transition-colors bg-purple-800/50 text-purple-300 hover:bg-purple-800`}
                        aria-label="Open AI avatar"
                        title="Talk with AI assistant"
                      >
                        <UserCircleIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={toggleVoiceOutput}
                        className={`p-2 rounded-lg transition-colors ${
                          isVoiceOutputActive 
                            ? 'bg-purple-700 text-white' 
                            : 'bg-purple-800/50 text-purple-300 hover:bg-purple-800'
                        }`}
                        aria-label={isVoiceOutputActive ? "Disable voice output" : "Enable voice output"}
                        title={isVoiceOutputActive ? "Disable voice output" : "Enable voice output"}
                      >
                        {isVoiceOutputActive ? (
                          <SpeakerWaveIcon className="w-5 h-5" />
                        ) : (
                          <SpeakerXMarkIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-2">
                  {chatMessages.map(message => (
                    <div 
                      key={message.id} 
                      className={`${message.sender === 'user' ? 'text-right' : ''}`}
                    >
                      <div 
                        className={`inline-block max-w-[80%] px-4 py-3 rounded-lg ${
                          message.sender === 'user' 
                            ? theme === 'dark' ? 'bg-[#2a355e] text-white' : 'bg-gray-200 text-gray-800'
                            : 'bg-gradient-to-r from-[#6016fc] to-[#7c3aed] text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs ${message.sender === 'user' 
                          ? theme === 'dark' ? 'text-gray-400' : 'text-gray-600' 
                          : 'text-purple-200'
                        } mt-1`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div>
                      <div className="inline-block max-w-[80%] px-4 py-3 rounded-lg bg-gradient-to-r from-[#6016fc] to-[#7c3aed]">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-150"></div>
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-300"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Input Area */}
                <div className={`flex ${theme === 'dark' ? 'bg-[#2a355e]' : 'bg-gray-200'} p-2 rounded-lg`}>
                  <input
                    type="text"
                    placeholder="Ask a question about this project..."
                    className={`flex-1 bg-transparent ${theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'} px-4 py-3 focus:outline-none`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    className="ml-2 bg-[#6016fc] text-white px-4 py-2 rounded-lg flex items-center"
                    onClick={() => handleSendMessage()}
                  >
                    <span>Send</span>
                  </button>
                </div>
              </div>
            )}
            
            {/* Project Info Tab */}
            {activeTab === 'info' && (
              <div className="flex-1 p-6 overflow-y-auto">
                <div className={`${theme === 'dark' ? 'bg-[#1a2548]' : 'bg-white'} rounded-lg shadow-lg p-6 mb-6`}>
                  <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4`}>Project Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>Timeline</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <ClockIcon className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mr-2 mt-0.5`} />
                          <div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Start Date</p>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                              {new Date(project.startDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {project.dueDate && (
                          <div className="flex items-start">
                            <ClockIcon className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mr-2 mt-0.5`} />
                            <div>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Due Date</p>
                              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                {new Date(project.dueDate).toLocaleDateString()}
                                {daysUntilDue !== null && (
                                  <span className={`ml-2 text-xs ${daysUntilDue < 0 ? 'text-red-500' : daysUntilDue < 7 ? 'text-yellow-500' : 'text-green-500'}`}>
                                    {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days remaining`}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {project.completedDate && (
                          <div className="flex items-start">
                            <ClockIcon className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mr-2 mt-0.5`} />
                            <div>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Completed Date</p>
                              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                {new Date(project.completedDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>Progress</h3>
                      <div className={`h-4 w-full ${theme === 'dark' ? 'bg-[#2a355e]' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                        <div 
                          className="h-full bg-[#6016fc]"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <p className={`text-right text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mt-1`}>{project.progress}% Complete</p>
                      
                      <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mt-4 mb-2`}>Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span 
                            key={tag} 
                            className={`${theme === 'dark' ? 'bg-[#2a355e] text-white' : 'bg-gray-200 text-gray-700'} px-3 py-1 rounded-lg text-xs`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="flex-1 p-6 overflow-y-auto">
                <div className={`${theme === 'dark' ? 'bg-[#1a2548]' : 'bg-white'} rounded-lg shadow-lg p-6`}>
                  <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4`}>Project Documents</h2>
                  
                  <div className="space-y-3">
                    {documents.map(doc => (
                      <div 
                        key={doc.id}
                        className={`flex items-center p-3 ${
                          theme === 'dark'
                            ? 'bg-[#2a355e] hover:bg-[#354173]'
                            : 'bg-gray-100 hover:bg-gray-200'
                        } rounded-lg transition-colors`}
                      >
                        {documentTypeIcons[doc.type]}
                        <div className="ml-3 flex-1">
                          <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{doc.name}</h3>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Updated {doc.lastUpdated}</p>
                        </div>
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#6016fc] hover:text-[#7c3aed]"
                        >
                          <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <footer className={`${theme === 'dark' ? 'bg-[#1a2548] border-[#2a355e]' : 'bg-white border-gray-200'} border-t py-4`}>
          <div className="container mx-auto px-4">
            <div className={`text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              © {new Date().getFullYear()} CCO VibeCoder. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
      
      {/* AI Avatar Modal */}
      {showAIModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-black/60' : 'bg-gray-800/40'} modal-backdrop ${showAIModal ? 'show' : ''}`}>
          <div 
            ref={modalRef}
            className={`relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-xl shadow-xl ${theme === 'dark' ? 'bg-gradient-to-b from-[#1a2548] to-[#121c42]' : 'bg-gradient-to-b from-white to-gray-100'} modal-content ${showAIModal ? 'show' : ''} flex flex-col`}
          >
            {/* Close button */}
            <button 
              onClick={toggleAIModal}
              className="absolute top-4 right-4 text-white hover:bg-purple-700/30 rounded-full p-1 z-10"
              aria-label="Close avatar"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            {/* 3D Avatar Area */}
            <div className="flex-1 flex flex-col">
              <div className="h-64 overflow-hidden relative bg-gradient-to-b from-[#6016fc] to-[#3a1c71] rounded-t-xl">
                {/* 3D Avatar Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="avatar-3d">
                    <div className="w-40 h-40 bg-[#6016fc] border-4 border-white/20 rounded-full flex items-center justify-center relative overflow-hidden">
                      {/* This would be replaced with an actual 3D avatar */}
                      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent"></div>
                      <div className="absolute inset-0 bg-[url('https://i.pravatar.cc/300')] bg-cover bg-center opacity-90"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#6016fc]/70 to-transparent"></div>
                      <SparklesIcon className="w-16 h-16 text-white z-10" />
                    </div>
                    
                    {/* Glow effect under the avatar */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-[#6016fc] filter blur-xl opacity-30 rounded-full"></div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#3a1c71] to-transparent"></div>
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="w-20 h-20 bg-white opacity-10 rounded-full absolute top-10 left-10 blur-xl"></div>
                  <div className="w-16 h-16 bg-purple-300 opacity-10 rounded-full absolute top-20 right-20 blur-xl"></div>
                </div>
              </div>
              
              {/* Speech Bubble */}
              <div className="p-6 relative flex-1">
                <div className="bg-[#6016fc] rounded-xl p-4 text-white mb-6 mt-2 chat-bubble">
                  <p className="text-lg">
                    {avatarMessage}
                    {avatarSpeaking && <span className="typing-cursor"></span>}
                  </p>
                </div>
                
                {/* Chat Input with Voice Toggle */}
                <div className="mt-auto">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage(messageInput, true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className={`w-full p-3 rounded-lg ${theme === 'dark' ? 'bg-[#2a355e] text-white' : 'bg-white text-gray-800'} border border-[#6016fc]/30 focus:outline-none focus:ring-2 focus:ring-[#6016fc]`}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                      />
                      {isRecording && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse delay-150"></div>
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse delay-300"></div>
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="bg-[#6016fc] text-white p-3 rounded-lg hover:bg-[#7c3aed] transition-colors"
                    >
                      <span className="sr-only">Send</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                    <button 
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`p-3 rounded-full transition-colors ${
                        isRecording 
                          ? 'bg-red-500 text-white' 
                          : 'bg-[#2a355e] text-gray-400 hover:bg-[#354173]'
                      }`}
                      aria-label={isRecording ? "Stop recording" : "Start voice input"}
                    >
                      <MicrophoneIcon className="h-6 w-6" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SharedProjectPage; 