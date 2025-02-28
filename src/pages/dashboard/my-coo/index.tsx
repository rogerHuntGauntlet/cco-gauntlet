import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { DataIntegrationNodeEditor } from '../../../components/dashboard/DataIntegrationNodeEditor';
import { integrationWorkflows } from '../../../utils/mockData';
import { 
  PlusIcon, 
  ArrowPathIcon, 
  PauseIcon, 
  PlayIcon,
  CommandLineIcon,
  LightBulbIcon,
  ChevronRightIcon,
  DocumentDuplicateIcon,
  CloudArrowUpIcon,
  CubeTransparentIcon,
  BoltIcon,
  ArrowPathRoundedSquareIcon,
  SparklesIcon,
  FolderIcon,
  CloudIcon,
  DocumentIcon,
  TableCellsIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XMarkIcon,
  CloudArrowDownIcon,
  CodeBracketIcon,
  CircleStackIcon,
  RectangleStackIcon,
  CalendarIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { IntegrationWorkflow, NodeType, IntegrationNode } from '../../../types';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { DndProvider, useDrag, useDrop, DragSourceMonitor, DropTargetMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Template type with proper node structure
interface IntegrationTemplate {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  category: string;
  complexity: string;
  estimatedTime: string;
  nodes: Array<{
    id: string;
    serviceId: string;
    position: { x: number; y: number };
    data: {
      label: string;
      type: NodeType;
      icon: string;
      connected: boolean;
      config: Record<string, unknown>;
    };
  }>;
}

// Example templates with proper node structure
const INTEGRATION_TEMPLATES: ReadonlyArray<IntegrationTemplate> = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Connect and sync your Google Drive files. Automatically backup and organize documents in real-time.',
    icon: <FolderIcon className="w-6 h-6" />,
    category: 'Cloud Storage',
    complexity: 'Simple',
    estimatedTime: '5 min',
    nodes: [
      {
        id: 'drive-source',
        serviceId: 'google-drive',
        position: { x: 100, y: 100 },
        data: {
          label: 'Google Drive',
          type: 'source',
          icon: 'drive',
          connected: false,
          config: {
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            watchInterval: 300 // 5 minutes
          }
        }
      },
      {
        id: 'file-processor',
        serviceId: 'processor',
        position: { x: 300, y: 100 },
        data: {
          label: 'File Processor',
          type: 'transform',
          icon: 'file',
          connected: false,
          config: {
            fileTypes: ['document', 'spreadsheet', 'pdf'],
            maxSize: 100 * 1024 * 1024 // 100MB
          }
        }
      },
      {
        id: 'storage',
        serviceId: 'storage',
        position: { x: 500, y: 100 },
        data: {
          label: 'Storage',
          type: 'destination',
          icon: 'database',
          connected: false,
          config: {
            compression: true,
            versioning: true
          }
        }
      }
    ]
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Integrate with Dropbox to automatically sync and manage files across your organization.',
    icon: <CloudIcon className="w-6 h-6" />,
    category: 'Cloud Storage',
    complexity: 'Simple',
    estimatedTime: '5 min',
    nodes: [
      {
        id: 'dropbox-source',
        serviceId: 'dropbox',
        position: { x: 100, y: 100 },
        data: {
          label: 'Dropbox',
          type: 'source',
          icon: 'dropbox',
          connected: false,
          config: {
            path: '/',
            watchChanges: true
          }
        }
      },
      {
        id: 'file-processor',
        serviceId: 'processor',
        position: { x: 300, y: 100 },
        data: {
          label: 'File Processor',
          type: 'transform',
          icon: 'file',
          connected: false,
          config: {
            fileTypes: ['document', 'spreadsheet', 'pdf'],
            maxSize: 100 * 1024 * 1024 // 100MB
          }
        }
      },
      {
        id: 'storage',
        serviceId: 'storage',
        position: { x: 500, y: 100 },
        data: {
          label: 'Storage',
          type: 'destination',
          icon: 'database',
          connected: false,
          config: {
            compression: true,
            versioning: true
          }
        }
      }
    ]
  },
  {
    id: 'templates',
    name: 'Templates',
    description: 'Upload and manage your document templates to ensure AI-generated content matches your preferred format and style.',
    icon: <DocumentDuplicateIcon className="w-6 h-6" />,
    category: 'Document Templates',
    complexity: 'Simple',
    estimatedTime: '2 min',
    nodes: [
      {
        id: 'template-source',
        serviceId: 'templates',
        position: { x: 100, y: 100 },
        data: {
          label: 'Template Library',
          type: 'source',
          icon: 'template',
          connected: false,
          config: {
            templates: [
              { name: 'Project PRD', type: 'document' },
              { name: 'Design Specs', type: 'document' },
              { name: 'User Prefs', type: 'document' }
            ]
          }
        }
      }
    ]
  }
] as const;

// Keyboard shortcuts configuration
interface ShortcutConfig {
  CREATE_WORKFLOW: string;
  TOGGLE_TIPS: string;
  FOCUS_SEARCH: string;
  SAVE_WORKFLOW: string;
}

const SHORTCUTS: ShortcutConfig = {
  CREATE_WORKFLOW: 'n',
  TOGGLE_TIPS: 't',
  FOCUS_SEARCH: '/',
  SAVE_WORKFLOW: 's',
} as const;

// Type for workflow status (using the type from IntegrationWorkflow)
type WorkflowStatus = IntegrationWorkflow['status'];

// Update IntegrationWorkflow type to use the correct status type
type StrictIntegrationWorkflow = Omit<IntegrationWorkflow, 'status'> & {
  status: WorkflowStatus;
};

// Empty template with proper node structure
const EMPTY_TEMPLATE: Omit<IntegrationTemplate, 'nodes'> & { nodes: never[] } = {
  id: 'empty',
  name: 'Empty Workflow',
  description: 'Start from scratch',
  icon: <PlusIcon className="w-6 h-6" />,
  category: 'Custom',
  complexity: 'Custom',
  estimatedTime: 'N/A',
  nodes: []
};

// Create a function to convert template to workflow
const createWorkflowFromTemplate = (template: IntegrationTemplate): IntegrationWorkflow => {
  const workflow: IntegrationWorkflow = {
    id: template.id,
    name: template.name,
    description: template.description,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: template.nodes.map(node => ({ ...node })),
    edges: []
  };
  return workflow;
};

// Update the mock workflows to have the correct type structure
const mockWorkflows: IntegrationWorkflow[] = [
  {
    id: 'mock-1',
    name: 'Customer Data Sync',
    description: 'Synchronize customer data between CRM and data warehouse',
    status: 'active' as const,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    nodes: [
      {
        id: 'source-1',
        serviceId: 'crm',
        position: { x: 100, y: 100 },
        data: {
          label: 'CRM',
          type: 'source' as const,
          icon: 'database',
          connected: true,
          config: {}
        }
      },
      {
        id: 'destination-1',
        serviceId: 'warehouse',
        position: { x: 300, y: 100 },
        data: {
          label: 'Warehouse',
          type: 'destination' as const,
          icon: 'database',
          connected: true,
          config: {}
        }
      }
    ],
    edges: []
  },
  {
    id: 'mock-2',
    name: 'Sales Analytics Pipeline',
    description: 'Process and analyze sales data in real-time',
    status: 'paused' as const,
    createdAt: '2024-03-14T15:30:00Z',
    updatedAt: '2024-03-15T09:00:00Z',
    nodes: [
      {
        id: 'source-2',
        serviceId: 'sales',
        position: { x: 100, y: 100 },
        data: {
          label: 'Sales Data',
          type: 'source' as const,
          icon: 'chart',
          connected: true,
          config: {}
        }
      },
      {
        id: 'transform-2',
        serviceId: 'transform',
        position: { x: 300, y: 100 },
        data: {
          label: 'Transform',
          type: 'transform' as const,
          icon: 'code',
          connected: true,
          config: {}
        }
      },
      {
        id: 'destination-2',
        serviceId: 'analytics',
        position: { x: 500, y: 100 },
        data: {
          label: 'Analytics',
          type: 'destination' as const,
          icon: 'chart',
          connected: true,
          config: {}
        }
      }
    ],
    edges: []
  }
];

interface DraggableTemplateCardProps {
  template: IntegrationTemplate;
  onSelect: () => void;
}

interface DragItem {
  template: IntegrationTemplate;
}

// Add new component for draggable template card
const DraggableTemplateCard: React.FC<DraggableTemplateCardProps> = ({ template, onSelect }) => {
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
    type: 'template',
    item: { template },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  return (
    <motion.div
      ref={drag}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`group cursor-pointer bg-white border border-cco-neutral-200 rounded-xl p-4 hover:shadow-md transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{
        boxShadow: isDragging ? '0 20px 25px -5px rgb(0 0 0 / 0.1)' : undefined
      }}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-3">
        <motion.div 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-cco-primary-100 text-cco-primary-600"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {template.icon}
        </motion.div>
        <h3 className="text-lg font-semibold text-cco-neutral-900 group-hover:text-cco-primary-600 transition-colors">
          {template.name}
        </h3>
      </div>
    </motion.div>
  );
};

// Add mock synced files data
const MOCK_SYNCED_FILES = {
  'google-drive': [
    {
      id: 'doc1',
      name: 'Q1 2024 Strategy Planning.docx',
      type: 'document',
      lastModified: '2024-03-18T14:30:00Z',
      size: '2.4 MB',
      icon: <DocumentIcon className="w-5 h-5" />,
      status: 'synced'
    },
    {
      id: 'sheet1',
      name: 'Sales Pipeline Analysis.xlsx',
      type: 'spreadsheet',
      lastModified: '2024-03-17T09:15:00Z',
      size: '1.8 MB',
      icon: <TableCellsIcon className="w-5 h-5" />,
      status: 'synced'
    },
    {
      id: 'pres1',
      name: 'Investor Pitch Deck.pptx',
      type: 'presentation',
      lastModified: '2024-03-16T16:45:00Z',
      size: '5.2 MB',
      icon: <DocumentIcon className="w-5 h-5" />,
      status: 'syncing'
    },
    {
      id: 'img1',
      name: 'Product Screenshots',
      type: 'folder',
      lastModified: '2024-03-15T11:20:00Z',
      size: '45 MB',
      icon: <FolderIcon className="w-5 h-5" />,
      status: 'synced'
    }
  ],
  'dropbox': [
    {
      id: 'proj1',
      name: 'Project Assets',
      type: 'folder',
      lastModified: '2024-03-18T13:00:00Z',
      size: '156 MB',
      icon: <FolderIcon className="w-5 h-5" />,
      status: 'synced'
    },
    {
      id: 'doc2',
      name: 'Technical Documentation.pdf',
      type: 'document',
      lastModified: '2024-03-17T15:30:00Z',
      size: '3.1 MB',
      icon: <DocumentIcon className="w-5 h-5" />,
      status: 'synced'
    },
    {
      id: 'img2',
      name: 'Brand Guidelines.ai',
      type: 'image',
      lastModified: '2024-03-16T10:45:00Z',
      size: '8.7 MB',
      icon: <PhotoIcon className="w-5 h-5" />,
      status: 'syncing'
    },
    {
      id: 'sheet2',
      name: 'Resource Allocation.xlsx',
      type: 'spreadsheet',
      lastModified: '2024-03-15T14:20:00Z',
      size: '1.2 MB',
      icon: <TableCellsIcon className="w-5 h-5" />,
      status: 'synced'
    }
  ]
};

// Add the FileSync component
const FileSyncView: React.FC<{ provider: 'google-drive' | 'dropbox' }> = ({ provider }) => {
  const files = MOCK_SYNCED_FILES[provider];
  const providerName = provider === 'google-drive' ? 'Google Drive' : 'Dropbox';
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search files..."
              className="pl-10 pr-4 py-2 border border-cco-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cco-primary-500 w-64"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-cco-neutral-400 absolute left-3 top-2.5" />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-cco-primary-500 text-white rounded-lg hover:bg-cco-primary-600 transition-colors">
            <ArrowUpTrayIcon className="w-5 h-5" />
            <span>Upload</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-cco-neutral-600">Last synced 2 minutes ago</span>
          <button className="p-2 hover:bg-cco-neutral-100 rounded-full transition-colors">
            <ArrowPathIcon className="w-5 h-5 text-cco-neutral-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 bg-white rounded-xl border border-cco-neutral-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-cco-neutral-200 bg-cco-neutral-50">
            <h3 className="font-medium text-cco-neutral-900">Synced Files from {providerName}</h3>
          </div>
          <div className="divide-y divide-cco-neutral-100">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => setSelectedFile(file.id)}
                className={`flex items-center justify-between px-4 py-3 hover:bg-cco-neutral-50 cursor-pointer ${
                  selectedFile === file.id ? 'bg-cco-neutral-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-cco-neutral-600">{file.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-cco-neutral-900">{file.name}</p>
                    <p className="text-xs text-cco-neutral-500">
                      {file.size} • Modified {new Date(file.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.status === 'syncing' ? (
                    <span className="flex items-center space-x-1 text-xs text-cco-primary-600">
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      <span>Syncing</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-xs text-cco-neutral-600">
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      <span>Synced</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-xl border border-cco-neutral-200">
          <div className="px-4 py-3 border-b border-cco-neutral-200 bg-cco-neutral-50 flex items-center justify-between">
            <h3 className="font-medium text-cco-neutral-900">File Assistant</h3>
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-cco-neutral-600" />
          </div>
          <div className="p-4">
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-cco-neutral-100 flex items-center justify-center mb-3">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-cco-neutral-400" />
              </div>
              <h4 className="text-sm font-medium text-cco-neutral-900 mb-1">
                Chat with your files
              </h4>
              <p className="text-xs text-cco-neutral-600 max-w-sm mx-auto">
                Select a file to start a conversation. Ask questions, request summaries, or get insights about your documents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add data providers configuration
const DATA_PROVIDERS = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Connect your Google Drive to sync documents, spreadsheets, and presentations.',
    icon: <FolderIcon className="w-6 h-6" />,
    category: 'Cloud Storage',
    setupTime: '5 min',
    popular: true
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Sync your Dropbox files and folders for seamless integration.',
    icon: <CloudIcon className="w-6 h-6" />,
    category: 'Cloud Storage',
    setupTime: '5 min',
    popular: true
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    description: 'Connect Microsoft OneDrive to access your business documents.',
    icon: <CloudArrowDownIcon className="w-6 h-6" />,
    category: 'Cloud Storage',
    setupTime: '5 min',
    popular: false
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Import your repositories, issues, and documentation.',
    icon: <CodeBracketIcon className="w-6 h-6" />,
    category: 'Development',
    setupTime: '8 min',
    popular: true
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Sync your Notion workspace, pages, and databases.',
    icon: <RectangleStackIcon className="w-6 h-6" />,
    category: 'Knowledge Base',
    setupTime: '6 min',
    popular: true
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Connect your CRM data, contacts, and opportunities.',
    icon: <CircleStackIcon className="w-6 h-6" />,
    category: 'Business',
    setupTime: '10 min',
    popular: false
  },
  {
    id: 'outlook',
    name: 'Outlook',
    description: 'Sync your emails, calendar events, and contacts.',
    icon: <EnvelopeIcon className="w-6 h-6" />,
    category: 'Communication',
    setupTime: '7 min',
    popular: false
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Import your calendar events and meeting details.',
    icon: <CalendarIcon className="w-6 h-6" />,
    category: 'Calendar',
    setupTime: '5 min',
    popular: false
  }
] as const;

// Add the DataProviderModal component
const DataProviderModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (providerId: string) => void;
}> = ({ isOpen, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(DATA_PROVIDERS.map(p => p.category)));
  
  const filteredProviders = DATA_PROVIDERS.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || provider.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
      >
        <div className="p-6 border-b border-cco-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-cco-neutral-900">Connect a Data Provider</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-cco-neutral-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-cco-neutral-500" />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-cco-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cco-primary-500"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-cco-neutral-400 absolute left-3 top-2.5" />
            </div>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-2 border border-cco-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cco-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          <div className="space-y-6">
            {/* Popular Providers */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-cco-neutral-700">Popular Integrations</h3>
              <div className="grid grid-cols-2 gap-4">
                {filteredProviders
                  .filter(p => p.popular)
                  .map(provider => (
                    <motion.button
                      key={provider.id}
                      onClick={() => onSelect(provider.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-start p-4 border border-cco-neutral-200 rounded-xl hover:border-cco-primary-500 hover:bg-cco-primary-50 transition-all text-left"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cco-neutral-100 flex items-center justify-center mr-4">
                        {provider.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-cco-neutral-900">{provider.name}</h4>
                        <p className="text-sm text-cco-neutral-600 mt-1">{provider.description}</p>
                        <p className="text-xs text-cco-neutral-500 mt-2">Setup time: {provider.setupTime}</p>
                      </div>
                    </motion.button>
                  ))}
              </div>
            </div>

            {/* Other Providers */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-cco-neutral-700">All Integrations</h3>
              <div className="grid grid-cols-2 gap-4">
                {filteredProviders
                  .filter(p => !p.popular)
                  .map(provider => (
                    <motion.button
                      key={provider.id}
                      onClick={() => onSelect(provider.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-start p-4 border border-cco-neutral-200 rounded-xl hover:border-cco-primary-500 hover:bg-cco-primary-50 transition-all text-left"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cco-neutral-100 flex items-center justify-center mr-4">
                        {provider.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-cco-neutral-900">{provider.name}</h4>
                        <p className="text-sm text-cco-neutral-600 mt-1">{provider.description}</p>
                        <p className="text-xs text-cco-neutral-500 mt-2">Setup time: {provider.setupTime}</p>
                      </div>
                    </motion.button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Node types and interfaces
interface Position {
  x: number;
  y: number;
}

interface Node {
  id: string;
  type: 'cco' | 'service';
  label: string;
  position: Position;
  serviceType?: string;
  icon?: JSX.Element;
}

interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  style: 'solid' | 'dashed';
}

// Grid settings
const GRID_SIZE = 20;
const snapToGrid = (position: Position): Position => ({
  x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
  y: Math.round(position.y / GRID_SIZE) * GRID_SIZE
});

// Connection context menu
const ConnectionContextMenu: React.FC<{
  position: Position;
  onToggleStyle: () => void;
  onClose: () => void;
}> = ({ position, onToggleStyle, onClose }) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.connection-menu')) {
        onClose();
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      className="connection-menu absolute bg-white rounded-lg shadow-lg py-1 z-50"
      style={{ left: position.x, top: position.y }}
    >
      <button
        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
        onClick={onToggleStyle}
      >
        Toggle Line Style
      </button>
    </div>
  );
};

// Node Canvas Component
const NodeCanvas: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 'cco',
      type: 'cco',
      label: 'Chief Cognitive Officer',
      position: { x: 400, y: 100 }
    },
    {
      id: 'google-drive',
      type: 'service',
      label: 'Google Drive',
      position: { x: 200, y: 200 },
      serviceType: 'Google Drive',
      icon: <FolderIcon className="w-5 h-5" />
    },
    {
      id: 'dropbox',
      type: 'service',
      label: 'Dropbox',
      position: { x: 300, y: 300 },
      serviceType: 'Dropbox',
      icon: <CloudIcon className="w-5 h-5" />
    },
    {
      id: 'templates',
      type: 'service',
      label: 'Templates',
      position: { x: 600, y: 200 },
      serviceType: 'Templates',
      icon: <DocumentDuplicateIcon className="w-5 h-5" />
    }
  ]);
  
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: 'conn-google-drive',
      sourceId: 'google-drive',
      targetId: 'cco',
      style: 'solid'
    },
    {
      id: 'conn-dropbox',
      sourceId: 'dropbox',
      targetId: 'cco',
      style: 'solid'
    },
    {
      id: 'conn-templates',
      sourceId: 'templates',
      targetId: 'cco',
      style: 'solid'
    }
  ]);
  
  const [contextMenu, setContextMenu] = useState<{ position: Position; connectionId: string } | null>(null);
  
  const addServiceNode = (serviceType: string, icon: JSX.Element) => {
    const newNode: Node = {
      id: `service-${Date.now()}`,
      type: 'service',
      label: serviceType,
      position: { x: 200, y: 200 },
      serviceType,
      icon
    };
    
    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      sourceId: newNode.id,
      targetId: 'cco',
      style: 'solid'
    };
    
    setNodes([...nodes, newNode]);
    setConnections([...connections, newConnection]);
  };

  const handleNodeDrag = (nodeId: string, newPosition: Position) => {
    const snappedPosition = snapToGrid(newPosition);
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, position: snappedPosition } : node
    ));
  };

  const handleConnectionContextMenu = (e: React.MouseEvent, connectionId: string) => {
    e.preventDefault();
    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      connectionId
    });
  };

  const toggleConnectionStyle = (connectionId: string) => {
    setConnections(connections.map(conn =>
      conn.id === connectionId
        ? { ...conn, style: conn.style === 'solid' ? 'dashed' : 'solid' }
        : conn
    ));
    setContextMenu(null);
  };

  return (
    <div className="relative w-full h-[500px] bg-gray-50 rounded-lg border border-gray-200">
      {/* Grid Background */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
            <path 
              d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} 
              fill="none" 
              stroke="rgba(0,0,0,0.1)" 
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="1" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {connections.map(connection => {
          const sourceNode = nodes.find(n => n.id === connection.sourceId);
          const targetNode = nodes.find(n => n.id === connection.targetId);
          if (!sourceNode || !targetNode) return null;

          const sourcePos = sourceNode.position;
          const targetPos = targetNode.position;

          return (
            <g key={connection.id} style={{ pointerEvents: 'all' }} onClick={(e) => handleConnectionContextMenu(e, connection.id)}>
              {/* Static base line */}
              <line
                x1={sourcePos.x + 75}
                y1={sourcePos.y + 30}
                x2={targetPos.x + 75}
                y2={targetPos.y + 30}
                stroke="#818cf8"
                strokeOpacity="0.2"
                strokeWidth="2"
                strokeDasharray={connection.style === 'dashed' ? '5,5' : undefined}
                className="cursor-pointer"
              />
              {/* Animated flow line */}
              <line
                x1={sourcePos.x + 75}
                y1={sourcePos.y + 30}
                x2={targetPos.x + 75}
                y2={targetPos.y + 30}
                stroke="url(#line-gradient)"
                strokeWidth="2"
                strokeDasharray={connection.style === 'dashed' ? '5,5' : '8,8'}
                className="cursor-pointer"
                style={{
                  animation: 'flowAnimation 2s linear infinite'
                }}
              />
            </g>
          );
        })}
      </svg>

      <style jsx>{`
        @keyframes flowAnimation {
          0% {
            stroke-dashoffset: 16;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      {/* Nodes */}
      {nodes.map(node => (
        <div
          key={node.id}
          className={`absolute cursor-move rounded-xl transition-all duration-200 ${
            node.type === 'cco' 
              ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-4 shadow-xl ring-2 ring-purple-500/30 backdrop-blur-sm animate-pulse-subtle' 
              : 'bg-gradient-to-b from-white to-gray-50 p-4 border border-gray-200/50 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/20 group'
          }`}
          style={{
            width: node.type === 'cco' ? 180 : 150,
            left: node.position.x,
            top: node.position.y,
            transform: 'translate(0, 0)',
            ...(node.type === 'cco' ? {
              boxShadow: '0 0 20px rgba(129, 140, 248, 0.3)',
              animation: 'float 3s ease-in-out infinite'
            } : {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease-in-out'
            })
          }}
          onMouseDown={(e) => {
            const startX = e.clientX - node.position.x;
            const startY = e.clientY - node.position.y;

            const handleMouseMove = (e: MouseEvent) => {
              handleNodeDrag(node.id, {
                x: e.clientX - startX,
                y: e.clientY - startY
              });
            };

            const handleMouseUp = () => {
              window.removeEventListener('mousemove', handleMouseMove);
              window.removeEventListener('mouseup', handleMouseUp);
            };

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
          }}
        >
          {node.type === 'cco' ? (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <SparklesIcon className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div>
                  <div className="font-semibold text-base">{node.label}</div>
                  <div className="text-xs text-white/80 mt-1">AI-Powered Assistant</div>
                </div>
              </div>
              <div className="absolute -inset-px bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur-sm"></div>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center space-x-3">
                {node.icon && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-gray-50 to-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    {node.type === 'service' && node.serviceType === 'Google Drive' ? (
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" 
                        alt="Google Drive"
                        className="w-5 h-5"
                      />
                    ) : node.type === 'service' && node.serviceType === 'Dropbox' ? (
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg" 
                        alt="Dropbox"
                        className="w-5 h-5"
                      />
                    ) : (
                      <div className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors duration-200">
                        {node.icon}
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <div className="font-medium text-sm text-gray-900 group-hover:text-indigo-700 transition-colors duration-200">{node.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">Connected Service</div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-indigo-50/0 to-indigo-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"></div>
            </div>
          )}
        </div>
      ))}

      <style jsx>{`
        @keyframes flowAnimation {
          0% {
            stroke-dashoffset: 16;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>

      {/* Context Menu */}
      {contextMenu && (
        <ConnectionContextMenu
          position={contextMenu.position}
          onToggleStyle={() => toggleConnectionStyle(contextMenu.connectionId)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export default function MyCOOPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<IntegrationWorkflow | null>(null);
  const [mode, setMode] = useState<'list' | 'edit'>('list');
  const [showKeyboardTips, setShowKeyboardTips] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<IntegrationTemplate | null>(null);
  const [draggedTemplate, setDraggedTemplate] = useState(null);
  const [showProviderModal, setShowProviderModal] = useState(false);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key) {
        case 'Escape':
          if (mode === 'edit') handleBackToList();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [mode]);

  const handleBackToList = () => {
    setSelectedTemplate(null);
    setSelectedWorkflow(null);
    setMode('list');
  };

  const handleEmptyTemplateClick = () => {
    setShowProviderModal(true);
  };

  const handleProviderSelect = (providerId: string) => {
    const template = INTEGRATION_TEMPLATES.find((t: IntegrationTemplate) => t.id === providerId);
    if (template) {
      setSelectedTemplate(template);
      setMode('edit');
    }
    setShowProviderModal(false);
  };

  return (
    <>
      <Head>
        <title>My COO | CCO VibeCoder Platform</title>
        <meta
          name="description"
          content="Integrate with external services and import data"
        />
      </Head>
      
      <DashboardLayout>
        <DndProvider backend={HTML5Backend}>
          <motion.div 
            className="space-y-6 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Keyboard Shortcuts Overlay */}
            {showKeyboardTips && (
              <div className="fixed bottom-6 right-6 bg-white/95 p-4 rounded-xl shadow-lg border border-cco-neutral-200 w-80 z-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-cco-neutral-900 flex items-center">
                    <CommandLineIcon className="w-4 h-4 mr-2" />
                    Keyboard Shortcuts
                  </h3>
                  <button 
                    onClick={() => setShowKeyboardTips(false)}
                    className="text-cco-neutral-500 hover:text-cco-neutral-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cco-neutral-600">Exit Editor</span>
                    <kbd className="px-2 py-1 bg-cco-neutral-100 rounded text-xs">esc</kbd>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <motion.div 
              className="bg-white rounded-xl p-6 shadow"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="max-w-3xl">
                  <h1 className="text-2xl font-bold text-cco-neutral-900">
                    {!selectedTemplate ? (
                      "Add Files to Chief Cognitive Officer"
                    ) : (
                      selectedTemplate.name
                    )}
                  </h1>
                  <div className="mt-2 space-y-2">
                    {!selectedTemplate ? (
                      <>
                        <p className="text-sm text-cco-neutral-600">
                          Your data will be securely processed and integrated into your second brain, providing valuable insights during meetings, 
                          enriching project context, and helping you make more informed decisions.
                        </p>
                      </>
                    ) : (
                      <p className="text-cco-neutral-600">
                        {selectedTemplate.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {selectedTemplate ? (
                    <motion.button 
                      onClick={handleBackToList}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-cco-neutral-100 text-cco-neutral-700 rounded-md hover:bg-cco-neutral-200 transition-colors"
                    >
                      Back to Templates
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleEmptyTemplateClick}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      <PlusIcon className="w-5 h-5 mr-2" />
                      Add Data
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="bg-white rounded-xl p-6">
              {!selectedTemplate ? (
                <div className="space-y-6">
                  {/* Connected Data Section */}
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <h2 className="text-base font-semibold text-cco-neutral-900">Connected Data</h2>
                      <div className="flex items-center space-x-3">
                        {/* Google Drive - Icon Only */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="h-8 w-8 flex items-center justify-center bg-white border border-cco-neutral-200 rounded-lg hover:shadow-sm transition-all"
                          onClick={() => {
                            const template = INTEGRATION_TEMPLATES.find(t => t.id === 'google-drive');
                            if (template) {
                              setSelectedTemplate(template);
                              setMode('edit');
                            }
                          }}
                        >
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" 
                            alt="Google Drive"
                            className="w-4 h-4"
                          />
                        </motion.button>

                        {/* Dropbox - Icon Only */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="h-8 w-8 flex items-center justify-center bg-white border border-cco-neutral-200 rounded-lg hover:shadow-sm transition-all"
                          onClick={() => {
                            const template = INTEGRATION_TEMPLATES.find(t => t.id === 'dropbox');
                            if (template) {
                              setSelectedTemplate(template);
                              setMode('edit');
                            }
                          }}
                        >
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg" 
                            alt="Dropbox"
                            className="w-4 h-4"
                          />
                        </motion.button>

                        {/* Templates - Compact Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="h-8 flex items-center space-x-2 px-3 bg-white border border-cco-neutral-200 rounded-lg hover:shadow-sm transition-all"
                          onClick={() => {
                            const template = INTEGRATION_TEMPLATES.find(t => t.id === 'templates');
                            if (template) {
                              setSelectedTemplate(template);
                              setMode('edit');
                            }
                          }}
                        >
                          <DocumentDuplicateIcon className="w-4 h-4 text-cco-neutral-600" />
                          <span className="text-sm text-cco-neutral-900">Templates</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Node Canvas */}
                  <NodeCanvas />
                </div>
              ) : (
                <motion.div 
                  className="h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  {selectedTemplate.id === 'google-drive' || selectedTemplate.id === 'dropbox' ? (
                    <FileSyncView provider={selectedTemplate.id} />
                  ) : (
                    <DataIntegrationNodeEditor 
                      workflow={createWorkflowFromTemplate(selectedTemplate)} 
                      mode={mode}
                    />
                  )}
                </motion.div>
              )}
            </div>

            {/* Add the modal */}
            <AnimatePresence>
              {showProviderModal && (
                <DataProviderModal
                  isOpen={showProviderModal}
                  onClose={() => setShowProviderModal(false)}
                  onSelect={handleProviderSelect}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </DndProvider>
      </DashboardLayout>
    </>
  );
} 