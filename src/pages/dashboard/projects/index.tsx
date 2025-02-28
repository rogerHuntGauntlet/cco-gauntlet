import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Head from 'next/head';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { 
  RectangleStackIcon, 
  PlusIcon, 
  ChartBarIcon,
  ClockIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  ListBulletIcon,
  TagIcon,
  CheckCircleIcon,
  FolderIcon,
  ShareIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useRouter } from 'next/router';

// Define project types
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

// Mock data for projects
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

// Interface for project filters
interface ProjectFilters {
  status: string[];
  priority: string[];
  tags: string[];
}

// Add this new interface
interface AIServiceModalState {
  isOpen: boolean;
  projectId: string | null;
  selectedService: string | null;
  generatedPrompt: string | null;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProjectFilters>({
    status: [],
    priority: [],
    tags: []
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  // Replace the dropdown state with modal state
  const [aiServiceModal, setAIServiceModal] = useState<AIServiceModalState>({
    isOpen: false,
    projectId: null,
    selectedService: null,
    generatedPrompt: null
  });
  const [showCursorInstructionsModal, setShowCursorInstructionsModal] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const buttonRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});
  const router = useRouter();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If we have an active dropdown and click is not on the button
      if (activeDropdownId) {
        const buttonElement = buttonRefs.current[activeDropdownId];
        
        if (buttonElement && !buttonElement.contains(event.target as Node)) {
          setActiveDropdownId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdownId]);
  
  // Compute all available tags for filtering
  const allTags = Array.from(
    new Set(projects.flatMap(project => project.tags))
  );
  
  // Filter projects based on search query and filters
  const filteredProjects = projects.filter(project => {
    // Search query filter
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.clientName && project.clientName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = filters.status.length === 0 || 
      filters.status.includes(project.status);
    
    // Priority filter
    const matchesPriority = filters.priority.length === 0 || 
      filters.priority.includes(project.priority);
    
    // Tags filter
    const matchesTags = filters.tags.length === 0 || 
      project.tags.some(tag => filters.tags.includes(tag));
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTags;
  });
  
  // Group projects by status
  const projectsByStatus = {
    active: filteredProjects.filter(p => p.status === 'active'),
    planning: filteredProjects.filter(p => p.status === 'planning'),
    onHold: filteredProjects.filter(p => p.status === 'on-hold'),
    completed: filteredProjects.filter(p => p.status === 'completed')
  };

  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  const handleProjectClick = (projectId: string) => {
    // Navigate to project details page
    router.push(`/dashboard/projects/${projectId}`);
  };

  const handleShareVibes = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    // Create the shareable link using window.location.origin
    const origin = window.location.origin;
    const shareableLink = `${origin}/shared-project/${project.id}`;
    
    // Copy link to clipboard
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        // Show success message - could be replaced with a toast notification in a real app
        alert(`Link copied to clipboard! Anyone with this link can view the "${project.name}" project.`);
      })
      .catch((error) => {
        console.error('Failed to copy link:', error);
        alert(`Error copying link. Please copy manually: ${shareableLink}`);
      });
  };

  // Replace handleAIAssist with this new version
  const handleAIAssist = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Open the modal with the current project
    setAIServiceModal({
      isOpen: true,
      projectId: project.id,
      selectedService: null,
      generatedPrompt: null
    });
  };
  
  // Add this new function to select an AI service
  const handleSelectAIService = (serviceName: string) => {
    const project = projects.find(p => p.id === aiServiceModal.projectId);
    if (!project) return;
    
    // Generate a platform-specific prompt based on the project details
    const prompt = generatePlatformPrompt(serviceName, project);
    
    setAIServiceModal(prev => ({
      ...prev,
      selectedService: serviceName,
      generatedPrompt: prompt
    }));
  };
  
  // Add this function to close the modal
  const closeAIServiceModal = () => {
    setAIServiceModal({
      isOpen: false,
      projectId: null,
      selectedService: null,
      generatedPrompt: null
    });
  };
  
  // Restore these filter functions that were accidentally removed
  const toggleStatusFilter = (status: string) => {
    setFilters(prev => {
      const statusFilters = prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status];
      
      return { ...prev, status: statusFilters };
    });
  };
  
  const togglePriorityFilter = (priority: string) => {
    setFilters(prev => {
      const priorityFilters = prev.priority.includes(priority)
        ? prev.priority.filter(p => p !== priority)
        : [...prev.priority, priority];
      
      return { ...prev, priority: priorityFilters };
    });
  };
  
  const toggleTagFilter = (tag: string) => {
    setFilters(prev => {
      const tagFilters = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      
      return { ...prev, tags: tagFilters };
    });
  };
  
  const clearFilters = () => {
    setFilters({
      status: [],
      priority: [],
      tags: []
    });
    setSearchQuery('');
  };
  
  // Add this function to generate platform-specific prompts
  const generatePlatformPrompt = (platform: string, project: Project): string => {
    const projectTags = project.tags.join(", ");
    const teamMembers = project.teamMembers.map(m => m.name).join(", ");
    const dueDate = project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "No deadline";
    
    // Base prompt content that's common across platforms
    const basePrompt = `Project: ${project.name}
Description: ${project.description}
Status: ${project.status}
Priority: ${project.priority}
Progress: ${project.progress}%
Tags: ${projectTags}
Team: ${teamMembers}
Due Date: ${dueDate}
`;
    
    // Platform-specific prompt formatting and additional instructions
    switch(platform) {
      case 'Cursor':
        return `/* Cursor AI Prompt */
${basePrompt}
TASK: Please help me implement the next feature for this project. Consider the project description and status.
Focus on clean, maintainable code with proper documentation.
Suggest unit tests where appropriate.`;
        
      case 'Replit':
        return `# Replit AI Assistant
${basePrompt}
I need help with this project on Replit. Please provide:
1. A step-by-step implementation plan
2. Code snippets that I can immediately use
3. Ideas for how to structure the application`;
        
      case 'Windsurf':
        return `// Windsurf by Codeium
${basePrompt}
CONTEXT: I'm working on this project and need implementation assistance.
GOAL: Help me develop new features or fix issues related to this project.
QUESTION: What's the best way to proceed with the next development phase?`;
        
      case 'Lovable':
        return `# Lovable AI Design Assistant
${basePrompt}
I need help designing the UI/UX for this project:
- Create a visually appealing interface that matches the project's purpose
- Ensure good usability and accessibility
- Provide mockups or wireframes for key screens
- Suggest color schemes and typography that fit the project's tone`;
        
      case 'v0':
        return `// v0 by Vercel Prompt
${basePrompt}
I need to generate a UI for this project using v0.
Key requirements:
- Clean, modern interface
- Responsive design
- Follow best accessibility practices
- Components should be reusable

Please generate the code for the main interface components.`;
        
      default:
        return basePrompt;
    }
  };
  
  // New function to show launch instructions for Cursor
  const showCursorLaunchInstructions = () => {
    // Copy prompt to clipboard first
    if (aiServiceModal.generatedPrompt) {
      navigator.clipboard.writeText(aiServiceModal.generatedPrompt);
    }
    
    // Show our custom modal with instructions
    setShowCursorInstructionsModal(true);
  };
  
  // Add this component for the AI Service Modal
  const AIServiceModal = () => {
    if (!aiServiceModal.isOpen) return null;
    
    const project = projects.find(p => p.id === aiServiceModal.projectId);
    if (!project) return null;
    
    // Service options with their logos
    const serviceOptions = [
      { name: 'Cursor', logo: '/cursor.jpeg' },
      { name: 'Windsurf', logo: '/windsurf.jpeg' },
      { name: 'Replit', logo: '/replit.png' },
      { name: 'Lovable', logo: '/lovable.jpeg' },
      { name: 'v0', logo: '/v0.png' }
    ];
    
    // Define the URLs for each service
    const serviceUrls = {
      'v0': 'https://v0.dev',
      'Lovable': 'https://ai.lovable.ai',
      'Replit': 'https://replit.com',
      'Windsurf': 'https://windsurf.codeium.com',
      'Cursor': 'https://cursor.sh'
    };
    
    // Function to try opening Cursor application
    const launchCursorApp = () => {
      // Try multiple protocol handlers for different platforms
      // This includes cursor://, cursor-app://, cursor:, etc.
      const protocolHandlers = [
        'cursor://',             // Standard protocol
        'cursor:',               // Windows protocol format
        'cursor-app://',         // Alternative format sometimes used
        'cursor-editor://'       // Another possible format
      ];
      
      let handlerIndex = 0;
      let handlerSuccess = false;
      
      // Function to try the next protocol handler in the list
      const tryNextHandler = () => {
        if (handlerIndex >= protocolHandlers.length || handlerSuccess) {
          // We've tried all handlers or one was successful
          if (!handlerSuccess) {
            // None worked, offer to download Cursor
            if (confirm('Cursor app doesn\'t seem to be installed or couldn\'t be launched. Would you like to download Cursor?')) {
              window.open('https://cursor.sh/download', '_blank', 'noopener,noreferrer');
            }
          }
          return;
        }
        
        const currentHandler = protocolHandlers[handlerIndex++];
        
        // Create an invisible iframe to try the protocol without changing the page
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        // Set a timer to detect if the protocol launch failed
        const protocolTimer = setTimeout(() => {
          // Protocol failed, try the next one
          document.body.removeChild(iframe);
          tryNextHandler();
        }, 500); // Shorter timeout since we're trying multiple options
        
        // Listen for successful protocol launch
        iframe.onload = () => {
          clearTimeout(protocolTimer);
          handlerSuccess = true;
          document.body.removeChild(iframe);
          console.log('Successfully launched Cursor with protocol:', currentHandler);
        };
        
        // Try to navigate to the protocol URL
        try {
          iframe.src = currentHandler;
        } catch (e) {
          // Error occurred, clean up and try next handler
          clearTimeout(protocolTimer);
          document.body.removeChild(iframe);
          console.error('Error with protocol:', currentHandler, e);
          tryNextHandler();
        }
      };
      
      // Start trying protocol handlers
      tryNextHandler();
      
      // Also try direct method using window.open
      try {
        const windowOpened = window.open('cursor://', '_blank');
        // If window is null, blocked by popup blocker
        if (!windowOpened) {
          console.log('Direct window.open blocked by browser');
        }
      } catch (e) {
        console.error('Error with direct window.open:', e);
      }
      
      // Try Windows-specific approaches
      if (navigator.userAgent.indexOf('Windows') !== -1) {
        // Create a hidden anchor tag for Windows URL protocol
        const winLink = document.createElement('a');
        winLink.style.display = 'none';
        winLink.href = 'cursor://';
        winLink.setAttribute('target', '_blank');
        document.body.appendChild(winLink);
        
        // Simulate a click on the link
        try {
          winLink.click();
        } catch (e) {
          console.error('Windows URL protocol approach failed:', e);
        } finally {
          // Clean up the anchor tag
          setTimeout(() => {
            document.body.removeChild(winLink);
          }, 100);
        }
      }
    };
    
    return ReactDOM.createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-cco-neutral-900">
              {aiServiceModal.selectedService 
                ? `${aiServiceModal.selectedService} AI Prompt for ${project.name}` 
                : `Generate AI Assistant Prompt for ${project.name}`}
            </h3>
            <button 
              onClick={closeAIServiceModal}
              className="text-cco-neutral-500 hover:text-cco-neutral-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          {!aiServiceModal.selectedService ? (
            <>
              <p className="text-cco-neutral-600 mb-4">
                Select an AI assistant platform to generate a tailored prompt for this project.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {serviceOptions.map(service => (
                  <button
                    key={service.name}
                    className="flex flex-col items-center justify-center p-4 border border-cco-neutral-200 rounded-lg hover:bg-cco-neutral-50 transition-colors"
                    onClick={() => handleSelectAIService(service.name)}
                  >
                    <img 
                      src={service.logo} 
                      alt={`${service.name} logo`} 
                      className="w-12 h-12 object-contain mb-3"
                    />
                    <span className="font-medium text-cco-neutral-900">{service.name}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-cco-neutral-600 mb-2">
                  Below is a generated prompt optimized for {aiServiceModal.selectedService}. Copy this and paste it into the {aiServiceModal.selectedService} interface.
                </p>
                
                <div className="bg-cco-neutral-50 border border-cco-neutral-200 rounded-md p-4 font-mono text-sm whitespace-pre-wrap overflow-auto max-h-96">
                  {aiServiceModal.generatedPrompt}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setAIServiceModal(prev => ({...prev, selectedService: null, generatedPrompt: null}))}
                >
                  Back to AI Services
                </Button>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="default"
                    onClick={() => {
                      if (aiServiceModal.generatedPrompt) {
                        navigator.clipboard.writeText(aiServiceModal.generatedPrompt);
                        // Show alert that prompt was copied
                        alert("Prompt copied to clipboard!");
                        
                        // If the selected service is Replit, open the Replit website
                        if (aiServiceModal.selectedService === 'Replit' && serviceUrls.Replit) {
                          window.open(serviceUrls.Replit, '_blank', 'noopener,noreferrer');
                        }
                      }
                    }}
                  >
                    Copy to Clipboard
                  </Button>
                  
                  {/* Add launch button for Cursor */}
                  {aiServiceModal.selectedService === 'Cursor' && (
                    <Button 
                      variant="accent"
                      onClick={() => {
                        // Try to launch Cursor desktop app
                        showCursorLaunchInstructions();
                      }}
                    >
                      Use with Cursor
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>,
      document.body
    );
  };
  
  // Project card component
  const ProjectCard = ({ project }: { project: Project }) => {
    const daysUntilDue = project.dueDate 
      ? Math.round((new Date(project.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : null;
    
    const statusColors = {
      'active': 'bg-green-100 text-green-800',
      'planning': 'bg-blue-100 text-blue-800',
      'on-hold': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-gray-100 text-gray-800'
    };
    
    const priorityColors = {
      'low': 'bg-blue-100 text-blue-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800'
    };
    
    const statusDisplay = project.status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    
    return (
      <Card 
        hover 
        className="overflow-hidden cursor-pointer"
        onClick={() => handleProjectClick(project.id)}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-cco-neutral-900 truncate">{project.name}</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                {statusDisplay}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[project.priority]}`}>
                {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-cco-neutral-600 mb-4 line-clamp-2">{project.description}</p>
          
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-cco-neutral-600">Progress</span>
              <span className="font-medium text-cco-neutral-900">{project.progress}%</span>
            </div>
            <div className="h-2 bg-cco-neutral-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cco-primary-500" 
                style={{ width: `${project.progress}%` }} 
              />
            </div>
          </div>
          
          {/* Date and team info */}
          <div className="mt-auto">
            {daysUntilDue !== null && (
              <div className="flex items-center text-xs text-cco-neutral-700 mb-2">
                <ClockIcon className="w-4 h-4 mr-1.5" />
                <span>
                  {daysUntilDue > 0 
                    ? `Due in ${daysUntilDue} days` 
                    : daysUntilDue === 0 
                    ? 'Due today' 
                    : `Overdue by ${Math.abs(daysUntilDue)} days`}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex -space-x-2">
                {project.teamMembers.slice(0, 3).map((member, index) => (
                  <img 
                    key={member.id} 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-7 h-7 rounded-full border-2 border-white"
                    title={member.name}
                  />
                ))}
                {project.teamMembers.length > 3 && (
                  <div className="w-7 h-7 rounded-full bg-cco-neutral-200 flex items-center justify-center text-xs font-medium text-cco-neutral-700 border-2 border-white">
                    +{project.teamMembers.length - 3}
                  </div>
                )}
              </div>
              
              {project.clientName && (
                <span className="text-xs text-cco-neutral-600">{project.clientName}</span>
              )}
            </div>
            
            {/* Tags */}
            {project.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {project.tags.slice(0, 3).map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cco-neutral-100 text-cco-neutral-800"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cco-neutral-100 text-cco-neutral-800">
                    +{project.tags.length - 3}
                  </span>
                )}
              </div>
            )}
            
            {/* Share Vibes Button */}
            <div className="mt-4 flex gap-2" onClick={e => e.stopPropagation()}>
              <Button 
                variant="accent" 
                size="sm" 
                className="flex-1"
                onClick={(e) => handleShareVibes(project, e)}
              >
                <ShareIcon className="w-5 h-5 mr-2" />
                Share Vibes
              </Button>
              
              <div className="relative">
                <Button
                  variant="secondary"
                  size="sm"
                  className="px-3"
                  onClick={(e) => handleAIAssist(project, e)}
                  title="AI Assistant"
                  ref={el => { buttonRefs.current[project.id] = el; }}
                >
                  <SparklesIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };
  
  // Filters sidebar component
  const FiltersSidebar = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border border-cco-neutral-200">
        <div className="mb-4">
          <h3 className="font-medium text-cco-neutral-900 mb-2">Status</h3>
          <div className="space-y-2">
            {['active', 'planning', 'on-hold', 'completed'].map(status => (
              <label key={status} className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.status.includes(status)}
                  onChange={() => toggleStatusFilter(status)}
                  className="rounded text-cco-primary-600 focus:ring-cco-primary-500"
                />
                <span className="text-sm text-cco-neutral-700">
                  {status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium text-cco-neutral-900 mb-2">Priority</h3>
          <div className="space-y-2">
            {['low', 'medium', 'high', 'urgent'].map(priority => (
              <label key={priority} className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.priority.includes(priority)}
                  onChange={() => togglePriorityFilter(priority)}
                  className="rounded text-cco-primary-600 focus:ring-cco-primary-500"
                />
                <span className="text-sm text-cco-neutral-700">
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium text-cco-neutral-900 mb-2">Tags</h3>
          <div className="space-y-2">
            {allTags.slice(0, 10).map(tag => (
              <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.tags.includes(tag)}
                  onChange={() => toggleTagFilter(tag)}
                  className="rounded text-cco-primary-600 focus:ring-cco-primary-500"
                />
                <span className="text-sm text-cco-neutral-700">{tag}</span>
              </label>
            ))}
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>
    );
  };

  // Add a new component for the Cursor Instructions Modal
  const CursorInstructionsModal = () => {
    if (!showCursorInstructionsModal) return null;
    
    const isWindows = navigator.userAgent.indexOf('Windows') !== -1;
    const isMac = navigator.userAgent.indexOf('Mac') !== -1;
    
    return ReactDOM.createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-cco-neutral-900">
              Using Your Prompt with Cursor
            </h3>
            <button 
              onClick={() => setShowCursorInstructionsModal(false)}
              className="text-cco-neutral-500 hover:text-cco-neutral-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center text-green-600 mb-4">
              <CheckCircleIcon className="w-6 h-6 mr-2" />
              <p className="font-medium">Prompt copied to clipboard!</p>
            </div>
            
            <p className="text-cco-neutral-600 mb-4">
              Due to browser security restrictions, we can't directly open the Cursor desktop app for you.
              Please follow these steps:
            </p>
            
            <div className="bg-cco-neutral-50 p-4 rounded-lg border border-cco-neutral-200 mb-4">
              <h4 className="font-medium text-cco-neutral-900 mb-2">
                {isWindows ? 'Windows' : isMac ? 'Mac' : 'General'} Instructions:
              </h4>
              <ol className="list-decimal pl-5 space-y-2 text-cco-neutral-700">
                <li>Open the Cursor desktop app manually</li>
                <li>Press {isWindows ? 'Ctrl+V' : isMac ? 'Cmd+V' : 'Paste'} to paste the prompt</li>
                <li>Press {isWindows ? 'Ctrl+Enter' : isMac ? 'Cmd+Enter' : 'Enter'} to submit</li>
              </ol>
            </div>
            
            {isWindows && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <span className="mr-2">💡</span> Windows Tips:
                </h4>
                <p className="text-blue-700 mb-3">
                  If you have Cursor installed, you can also try typing "cursor" in the Windows search (Start menu) 
                  to quickly find and open the app.
                </p>
                <button 
                  className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors w-full mb-3"
                  onClick={() => {
                    // Try to use the Windows Run dialog approach
                    try {
                      const link = document.createElement('a');
                      link.href = 'cursor://';
                      document.body.appendChild(link);
                      link.click();
                      setTimeout(() => {
                        document.body.removeChild(link);
                      }, 100);
                    } catch (e) {
                      console.error('Windows link click approach failed:', e);
                    }
                  }}
                >
                  Try to Launch Cursor
                </button>
                
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">For advanced users:</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    You can try to run Cursor from these common installation paths:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <button 
                      className="text-blue-800 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded text-xs font-mono transition-colors text-left"
                      onClick={() => {
                        const runCmd = `powershell -Command "Start-Process -FilePath 'C:\\Users\\${navigator.userAgent.split('NT ')[1]?.split(';')[0] || 'CURRENT_USER'}\\AppData\\Local\\Programs\\Cursor\\Cursor.exe'"`;
                        console.log("Would execute:", runCmd);
                        alert("Due to browser security restrictions, we can't run this command directly. Please manually open Cursor from your Start menu or desktop shortcut.");
                      }}
                    >
                      %LOCALAPPDATA%\Programs\Cursor\Cursor.exe
                    </button>
                    <button 
                      className="text-blue-800 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded text-xs font-mono transition-colors text-left"
                      onClick={() => {
                        alert("Due to browser security restrictions, we can't run this command directly. Please manually open Cursor from your Start menu or desktop shortcut.");
                      }}
                    >
                      %PROGRAMFILES%\Cursor\Cursor.exe
                    </button>
                  </div>
                </div>
                
                <p className="text-xs text-blue-600 mt-2">
                  Note: These methods may not work due to browser security restrictions, but they're worth a try!
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowCursorInstructionsModal(false)}
            >
              Close
            </Button>
            
            <Button 
              variant="accent"
              onClick={() => {
                window.open('https://cursor.sh/download', '_blank', 'noopener,noreferrer');
              }}
            >
              Download Cursor
            </Button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <Head>
        <title>Projects | CCO VibeCoder Platform</title>
        <meta
          name="description"
          content="Manage your projects, track progress, and collaborate with your team"
        />
      </Head>
      
      <DashboardLayout>
        {/* Replace the AIServicesDropdown with AIServiceModal */}
        <AIServiceModal />
        
        <div className="container mx-auto px-4">
          {/* Header with actions */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-cco-neutral-900">Projects</h1>
            <div className="flex space-x-3">
              <Button
                variant="default"
                onClick={handleCreateProject}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                New Project
              </Button>
            </div>
          </div>
          
          {/* Search and view options */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full px-4 py-2 pl-10 rounded-md border border-cco-neutral-300 focus:outline-none focus:ring-2 focus:ring-cco-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-cco-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Main content with filters sidebar and projects */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters sidebar */}
            <div className="lg:w-1/4">
              <FiltersSidebar />
            </div>
            
            {/* Projects grid */}
            <div className="lg:w-3/4">
              {filteredProjects.length === 0 ? (
                <Card className="bg-cco-neutral-50 border-dashed p-8">
                  <div className="flex flex-col items-center justify-center text-center">
                    <RectangleStackIcon className="w-16 h-16 text-cco-neutral-400 mb-4" />
                    <h3 className="text-lg font-medium text-cco-neutral-900 mb-2">No projects found</h3>
                    <p className="text-cco-neutral-600 mb-6 max-w-md">
                      {searchQuery || Object.values(filters).some(f => f.length > 0) 
                        ? "No projects match your current filters. Try adjusting your search criteria or clearing your filters."
                        : "You don't have any projects yet. Create a new project to get started."}
                    </p>
                    <div className="flex space-x-4">
                      {(searchQuery || Object.values(filters).some(f => f.length > 0)) && (
                        <Button 
                          variant="outline"
                          onClick={clearFilters}
                        >
                          Clear Filters
                        </Button>
                      )}
                      <Button 
                        variant="default"
                        onClick={handleCreateProject}
                      >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Create Project
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="space-y-8">
                  {projectsByStatus.active.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-cco-neutral-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Active Projects
                      </h2>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {projectsByStatus.active.map(project => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {projectsByStatus.planning.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-cco-neutral-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Planning
                      </h2>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {projectsByStatus.planning.map(project => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {projectsByStatus.onHold.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-cco-neutral-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        On Hold
                      </h2>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {projectsByStatus.onHold.map(project => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {projectsByStatus.completed.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-cco-neutral-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                        Completed
                      </h2>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {projectsByStatus.completed.map(project => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Create Project Modal - simplified version */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="project-name" className="block text-sm font-medium text-cco-neutral-700 mb-1">
                      Project Name
                    </label>
                    <input 
                      type="text"
                      id="project-name"
                      className="w-full px-3 py-2 border border-cco-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cco-primary-500"
                      placeholder="Enter project name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="project-description" className="block text-sm font-medium text-cco-neutral-700 mb-1">
                      Description
                    </label>
                    <textarea 
                      id="project-description"
                      className="w-full px-3 py-2 border border-cco-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cco-primary-500"
                      placeholder="Enter project description"
                      rows={3}
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="project-status" className="block text-sm font-medium text-cco-neutral-700 mb-1">
                        Status
                      </label>
                      <select 
                        id="project-status"
                        className="w-full px-3 py-2 border border-cco-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cco-primary-500"
                      >
                        <option value="planning">Planning</option>
                        <option value="active">Active</option>
                        <option value="on-hold">On Hold</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="project-priority" className="block text-sm font-medium text-cco-neutral-700 mb-1">
                        Priority
                      </label>
                      <select 
                        id="project-priority"
                        className="w-full px-3 py-2 border border-cco-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cco-primary-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6 space-x-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="default">
                    Create Project
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
      
      {/* Add the Cursor Instructions Modal */}
      <CursorInstructionsModal />
    </>
  );
};

export default ProjectsPage; 