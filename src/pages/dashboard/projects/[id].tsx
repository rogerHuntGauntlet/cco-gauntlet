import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DashboardLayout from '../../../components/layout/DashboardLayout';
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
  PencilIcon,
  TrashIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

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

// Mock team members data (same as in the dashboard)
const mockTeamMembers = [
  { id: 'u1', name: 'Alex Johnson', role: 'Project Manager', avatar: 'https://i.pravatar.cc/150?img=68' },
  { id: 'u2', name: 'Sarah Williams', role: 'Designer', avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: 'u3', name: 'Michael Chen', role: 'Developer', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: 'u4', name: 'Emily Davis', role: 'Content Writer', avatar: 'https://i.pravatar.cc/150?img=23' },
  { id: 'u5', name: 'James Wilson', role: 'QA Engineer', avatar: 'https://i.pravatar.cc/150?img=59' }
];

// Mock projects data (same as in the dashboard)
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

const mockDocuments: ProjectDocument[] = [
  { id: 'd1', name: 'Project Brief', type: 'PDF', lastUpdated: '2023-06-15', url: '#' },
  { id: 'd2', name: 'Design Mockups', type: 'Figma', lastUpdated: '2023-07-02', url: '#' },
  { id: 'd3', name: 'Content Strategy', type: 'DOCX', lastUpdated: '2023-06-28', url: '#' },
  { id: 'd4', name: 'Technical Specifications', type: 'PDF', lastUpdated: '2023-06-20', url: '#' },
  { id: 'd5', name: 'User Research', type: 'PPTX', lastUpdated: '2023-06-10', url: '#' }
];

const ProjectDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'documents'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  
  // In a real app, this would fetch project data from an API
  useEffect(() => {
    if (id) {
      // Find the project by ID from mock data
      const foundProject = mockProjects.find(p => p.id === id);
      if (foundProject) {
        setProject(foundProject);
        
        // Simulate fetching related documents
        setDocuments(mockDocuments.slice(0, 3 + Math.floor(Math.random() * 3)));
      }
    }
  }, [id]);
  
  if (!project) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">Loading project...</h1>
            <p className="text-gray-600 mt-2">Please wait while we retrieve the project details.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
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
  const daysUntilDue = project.dueDate 
    ? Math.round((new Date(project.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  const handleShareProject = () => {
    // Create the shareable link using window.location.origin
    const origin = window.location.origin;
    const shareableLink = `${origin}/shared-project/${project.id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        alert('Shareable link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
      });
  };
  
  const handleEditProject = () => {
    setIsEditing(true);
  };
  
  const handleDeleteProject = () => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      // In a real app, this would call an API to delete the project
      alert('Project deleted successfully!');
      router.push('/dashboard/projects');
    }
  };
  
  return (
    <DashboardLayout>
      <Head>
        <title>{project.name} | Project Details | CCO VibeCoder</title>
        <meta name="description" content={project.description} />
      </Head>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <span className={`ml-4 px-3 py-1 text-sm font-medium rounded-full ${statusColors[project.status as keyof typeof statusColors]}`}>
                {statusDisplay}
              </span>
              <span className={`ml-2 px-3 py-1 text-sm font-medium rounded-full ${priorityColors[project.priority]}`}>
                {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
              </span>
            </div>
            <p className="mt-2 text-lg text-gray-600">{project.description}</p>
            {project.clientName && (
              <p className="mt-1 text-sm text-gray-500">Client: {project.clientName}</p>
            )}
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button 
              variant="outline"
              size="md"
              onClick={handleShareProject}
              className="flex items-center"
            >
              <ShareIcon className="h-5 w-5 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline"
              size="md"
              onClick={handleEditProject}
              className="flex items-center"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline"
              size="md"
              onClick={handleDeleteProject}
              className="flex items-center text-red-600 hover:text-white hover:bg-red-600 border-red-200 hover:border-red-600"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress: {project.progress}%</span>
            {daysUntilDue !== null && (
              <span className={`text-sm font-medium ${daysUntilDue < 0 ? 'text-red-600' : daysUntilDue <= 7 ? 'text-yellow-600' : 'text-gray-600'}`}>
                {daysUntilDue < 0 
                  ? `Overdue by ${Math.abs(daysUntilDue)} days` 
                  : daysUntilDue === 0 
                    ? 'Due today'
                    : `${daysUntilDue} days left`}
              </span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-purple-600 h-2.5 rounded-full"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`${
                activeTab === 'team'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Team
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`${
                activeTab === 'documents'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Documents
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Key Info */}
              <Card className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Project Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(project.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {project.dueDate 
                        ? new Date(project.dueDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Not set'}
                    </p>
                  </div>
                  {project.completedDate && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Completed Date</h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(project.completedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Timeline/Milestones would go here in a real app */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                  <Button variant="ghost" size="sm">View all</Button>
                </div>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Design mockup uploaded</p>
                      <p className="text-sm text-gray-500">2 days ago by Sarah Williams</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Client feedback received</p>
                      <p className="text-sm text-gray-500">3 days ago by Alex Johnson</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <UsersIcon className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">New team member added</p>
                      <p className="text-sm text-gray-500">1 week ago by Alex Johnson</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          {activeTab === 'team' && (
            <div>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Team Members</h2>
                  <Button variant="default" size="sm">Add Member</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.teamMembers.map(member => (
                    <div key={member.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="h-12 w-12 rounded-full object-cover" 
                      />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
          
          {activeTab === 'documents' && (
            <div>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Project Documents</h2>
                  <Button variant="default" size="sm">Upload Document</Button>
                </div>
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {documents.map((document) => (
                        <tr key={document.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{document.name}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{document.type}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{document.lastUpdated}</td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a href={document.url} className="text-purple-600 hover:text-purple-900">
                              View<span className="sr-only">, {document.name}</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                      {documents.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                            No documents found. Upload a document to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetailsPage; 