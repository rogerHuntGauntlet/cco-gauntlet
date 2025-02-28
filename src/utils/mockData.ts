import { User, Meeting, Project, Document, ActionItem, Dashboard, MeetingInsight, Recommendation, NodeType } from '../types';
import { formatDistanceToNow, subDays, addDays, format } from 'date-fns';

// Mock Users
export const currentUser: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@vibecoder.dev',
  role: 'vibecoder',
  avatar: 'https://i.pravatar.cc/150?img=68',
};

export const clientUser: User = {
  id: 'u2',
  name: 'Jordan Smith',
  email: 'jordan@clientcompany.com',
  role: 'client',
  avatar: 'https://i.pravatar.cc/150?img=35',
};

// Mock Documents from the recent meeting
export const recentMeetingDocs: Document[] = [
  {
    id: 'd1',
    title: 'Project Requirements Document',
    type: 'prd',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: `# E-Commerce Platform Requirements

## Overview
The client requires a modern e-commerce platform with advanced AI-powered recommendations and seamless payment processing.

## Key Features
1. Personalized product recommendations
2. Integrated payment processing
3. Inventory management
4. Customer account management
5. Admin dashboard for analytics
6. Mobile-responsive design

## Technical Requirements
- React frontend with Next.js
- Node.js backend
- PostgreSQL database
- Redis for caching
- AWS infrastructure
- CI/CD pipeline

## Timeline
- MVP: 2 months
- Full launch: 4 months`,
    status: 'draft',
    tags: ['e-commerce', 'requirements', 'ai'],
  },
  {
    id: 'd2',
    title: 'Technical Architecture Proposal',
    type: 'other',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: `# E-Commerce Platform Architecture

## Frontend
- Next.js for server-side rendering
- TailwindCSS for styling
- Redux for state management
- Jest for testing

## Backend
- Express.js API layer
- GraphQL for complex queries
- JWT authentication
- Microservices for payments and recommendations

## Database
- PostgreSQL for relational data
- Redis for session storage and caching
- Elasticsearch for product search

## Infrastructure
- Docker containers
- Kubernetes orchestration
- AWS hosting
- CloudFront CDN

## CI/CD
- GitHub Actions
- Automated testing
- Staging and production environments`,
    status: 'draft',
    tags: ['architecture', 'technical', 'infrastructure'],
  },
  {
    id: 'd3',
    title: 'E-Commerce Platform Code Scaffold',
    type: 'code_scaffold',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: `# E-Commerce Platform Code Scaffold

## Project Structure
\`\`\`
e-commerce-platform/
├── client/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── utils/
├── server/
│   ├── api/
│   ├── models/
│   ├── services/
│   └── utils/
├── shared/
└── docs/
\`\`\`

## Initial Setup Steps
1. Initialize Next.js project
2. Set up Express backend
3. Configure PostgreSQL connection
4. Create authentication system
5. Set up product catalog models
6. Create shopping cart functionality
7. Implement payment processing
8. Build admin dashboard

## Key Dependencies
- Next.js
- Tailwind CSS
- Express
- Sequelize
- Passport.js
- Stripe
- Jest
- TypeScript`,
    status: 'draft',
    tags: ['code', 'scaffold', 'structure'],
  },
];

// Recent successful meeting
export const recentMeeting: Meeting = {
  id: 'm1',
  title: 'E-Commerce Platform Initial Planning',
  date: new Date().toISOString(),
  duration: 60,
  participants: [currentUser, clientUser],
  projectId: 'p1',
  recordingUrl: 'https://example.com/recording1',
  transcriptUrl: 'https://example.com/transcript1',
  status: 'completed',
  summary: 'Discussed requirements for new e-commerce platform. Client needs personalized product recommendations, inventory management, and mobile-responsive design. Timeline is 4 months with MVP in 2 months.',
  keyHighlights: [
    'Budget approved for full project scope',
    'AI-powered recommendations are top priority',
    'Mobile experience is crucial for target audience',
    'Integration with existing inventory system required',
    'Launch planned for Q3 2023'
  ],
  actionItems: [
    {
      id: 'a1',
      description: 'Create detailed project timeline',
      assignedTo: 'u1',
      dueDate: addDays(new Date(), 3).toISOString(),
      status: 'open',
      priority: 'high',
    },
    {
      id: 'a2',
      description: 'Schedule technical architecture review',
      assignedTo: 'u1',
      dueDate: addDays(new Date(), 5).toISOString(),
      status: 'open',
      priority: 'medium',
    },
    {
      id: 'a3',
      description: 'Provide access to existing inventory system',
      assignedTo: 'u2',
      dueDate: addDays(new Date(), 2).toISOString(),
      status: 'open',
      priority: 'high',
    },
  ],
  documents: recentMeetingDocs,
};

// Latest project
export const ecommerceProject: Project = {
  id: 'p1',
  name: 'E-Commerce Platform',
  description: 'Modern e-commerce solution with AI-powered recommendations',
  clientId: 'u2',
  vibecoderId: 'u1',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  meetings: [recentMeeting],
  documents: recentMeetingDocs,
  tags: ['e-commerce', 'web', 'ai'],
};

// Older projects
export const previousProjects: Project[] = [
  {
    id: 'p2',
    name: 'CRM Dashboard Redesign',
    description: 'UI/UX overhaul of customer relationship management system',
    clientId: 'u3',
    vibecoderId: 'u1',
    status: 'completed',
    createdAt: subDays(new Date(), 60).toISOString(),
    updatedAt: subDays(new Date(), 30).toISOString(),
    meetings: [],
    documents: [],
    tags: ['crm', 'ui/ux', 'dashboard'],
  },
  {
    id: 'p3',
    name: 'Inventory Management API',
    description: 'RESTful API for inventory tracking and management',
    clientId: 'u4',
    vibecoderId: 'u1',
    status: 'active',
    createdAt: subDays(new Date(), 45).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
    meetings: [],
    documents: [],
    tags: ['api', 'inventory', 'backend'],
  },
];

// Upcoming meeting
export const upcomingMeeting: Meeting = {
  id: 'm2',
  title: 'API Integration Planning',
  date: addDays(new Date(), 2).toISOString(),
  duration: 45,
  participants: [currentUser, { id: 'u4', name: 'Taylor Wong', email: 'taylor@clientb.com', role: 'client' }],
  projectId: 'p3',
  status: 'scheduled',
  actionItems: [],
  documents: [],
};

// Meeting insights for the recent meeting
export const recentMeetingInsight: MeetingInsight = {
  meetingId: 'm1',
  sentiment: 'positive',
  topics: ['e-commerce', 'product recommendations', 'inventory management', 'mobile design', 'timeline', 'budget'],
  keyTakeaways: [
    'Client has high expectations for AI recommendation quality',
    'Mobile experience is top priority for their customer base',
    'Security compliance is essential due to payment processing',
    'Current inventory system uses outdated API that needs special handling',
  ],
  clientFeedback: 'Very impressed with the initial suggestions and timeline. Looking forward to seeing the first prototype.',
  clientEngagement: 92,
  followUpRecommendations: [
    'Share detailed AI recommendation strategy document',
    'Provide case studies of similar successful implementations',
    'Schedule technical deep dive on inventory system integration',
  ],
};

// Recommendations from the meeting
export const meetingRecommendations: Recommendation[] = [
  {
    id: 'r1',
    type: 'code',
    content: 'Consider using Elasticsearch for product search to improve performance and relevance scoring',
    context: 'Discussion about search functionality',
    timestamp: '15:23',
    relevant: true,
  },
  {
    id: 'r2',
    type: 'design',
    content: 'Implement skeleton loading screens for mobile product pages to improve perceived performance',
    context: 'Discussion about mobile experience',
    timestamp: '27:45',
    relevant: true,
  },
  {
    id: 'r3',
    type: 'process',
    content: 'Establish bi-weekly user testing sessions throughout development',
    context: 'Discussion about quality assurance',
    timestamp: '42:18',
    relevant: true,
  },
  {
    id: 'r4',
    type: 'communication',
    content: 'Create a shared glossary of technical terms to ensure alignment between teams',
    context: 'Confusion about terminology',
    timestamp: '37:02',
    relevant: true,
  },
];

// Mock Notifications
export const notifications = [
  {
    id: 'n1',
    title: 'New Meeting Scheduled',
    message: 'Technical review for E-Commerce Platform scheduled for March 10, 2023',
    type: 'meeting' as const,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    link: '/meetings/m3',
    relatedItemId: 'm3',
    relatedItemType: 'meeting' as const,
  },
  {
    id: 'n2',
    title: 'Document Updated',
    message: 'Jordan Smith updated "Technical Architecture Proposal"',
    type: 'document' as const,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    link: '/documents/d2',
    relatedItemId: 'd2',
    relatedItemType: 'document' as const,
  },
  {
    id: 'n3',
    title: 'Action Item Reminder',
    message: 'Due tomorrow: Create detailed project timeline',
    type: 'action' as const,
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    link: '/action-items/a1',
    relatedItemId: 'a1',
    relatedItemType: 'action' as const,
  },
  {
    id: 'n4',
    title: 'Meeting Recording Available',
    message: 'Recording for "E-Commerce Platform Initial Planning" is now available',
    type: 'meeting' as const,
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    link: '/meetings/m1',
    relatedItemId: 'm1',
    relatedItemType: 'meeting' as const,
  },
  {
    id: 'n5',
    title: 'New Project Created',
    message: 'New project "Inventory Management API" has been created',
    type: 'project' as const,
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    link: '/projects/p3',
    relatedItemId: 'p3',
    relatedItemType: 'project' as const,
  },
  {
    id: 'n6',
    title: 'System Update',
    message: 'VibeCoder has been updated with new AI features',
    type: 'system' as const,
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
  {
    id: 'n7',
    title: 'Document Generated',
    message: 'New document "E-Commerce Platform Code Scaffold" has been generated',
    type: 'document' as const,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
    link: '/documents/d3',
    relatedItemId: 'd3',
    relatedItemType: 'document' as const,
  },
];

// Update dashboardData to include notifications
export const dashboardData = {
  recentMeetings: [recentMeeting],
  upcomingMeetings: [upcomingMeeting],
  activeProjects: [ecommerceProject, previousProjects[1]],
  recentDocuments: recentMeetingDocs,
  pendingActionItems: recentMeeting.actionItems || [],
  notifications: notifications,
};

// Integration workflows
export const integrationWorkflows = [
  {
    id: '1',
    name: 'Google Drive Document Import',
    description: 'Import documents from Google Drive and process them',
    nodes: [
      {
        id: 'node-1',
        serviceId: 'google-drive',
        position: { x: 100, y: 200 },
        data: {
          label: 'Google Drive',
          type: 'source' as NodeType,
          icon: '📄',
          connected: true,
          config: {
            folderId: '1a2b3c4d5e6f7g8h9i0j',
            fileTypes: ['pdf', 'docx', 'txt']
          }
        }
      },
      {
        id: 'node-2',
        serviceId: 'filter',
        position: { x: 400, y: 200 },
        data: {
          label: 'Filter',
          type: 'transform' as NodeType,
          icon: '🔍',
          connected: true,
          config: {
            conditions: [
              { field: 'fileName', operator: 'contains', value: 'report' }
            ]
          }
        }
      },
      {
        id: 'node-3',
        serviceId: 'data-store',
        position: { x: 700, y: 200 },
        data: {
          label: 'Data Store',
          type: 'destination' as NodeType,
          icon: '💾',
          connected: true,
          config: {
            storageType: 'internal',
            category: 'reports'
          }
        }
      }
    ],
    edges: [
      {
        id: 'edge-1-2',
        source: 'node-1',
        target: 'node-2',
        animated: true
      },
      {
        id: 'edge-2-3',
        source: 'node-2',
        target: 'node-3',
        animated: true
      }
    ],
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-20T15:30:00Z',
    status: 'active'
  },
  {
    id: '2',
    name: 'CRM Data Sync',
    description: 'Sync customer data from CRM to internal database',
    nodes: [
      {
        id: 'node-1',
        serviceId: 'api',
        position: { x: 100, y: 200 },
        data: {
          label: 'CRM API',
          type: 'source' as NodeType,
          icon: '🔌',
          connected: true,
          config: {
            endpoint: 'https://api.crm.example.com/customers',
            authType: 'oauth'
          }
        }
      },
      {
        id: 'node-2',
        serviceId: 'transform',
        position: { x: 400, y: 200 },
        data: {
          label: 'Transform',
          type: 'transform' as NodeType,
          icon: '🔄',
          connected: true,
          config: {
            mappings: [
              { source: 'customerName', target: 'name' },
              { source: 'customerEmail', target: 'email' }
            ]
          }
        }
      },
      {
        id: 'node-3',
        serviceId: 'data-store',
        position: { x: 700, y: 200 },
        data: {
          label: 'Database',
          type: 'destination' as NodeType,
          icon: '🗄️',
          connected: true,
          config: {
            tableName: 'customers',
            updateStrategy: 'upsert'
          }
        }
      }
    ],
    edges: [
      {
        id: 'edge-1-2',
        source: 'node-1',
        target: 'node-2',
        animated: true
      },
      {
        id: 'edge-2-3',
        source: 'node-2',
        target: 'node-3',
        animated: true
      }
    ],
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-02-18T11:45:00Z',
    status: 'active'
  }
]; 