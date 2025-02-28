import React, { useState } from 'react';
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
  FolderIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

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

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProjectFilters>({
    status: [],
    priority: [],
    tags: []
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  
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
    // In a real app, this would navigate to project details
    console.log('Navigate to project', projectId);
  };

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
    </>
  );
};

export default ProjectsPage; 