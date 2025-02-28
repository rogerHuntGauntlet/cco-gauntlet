import React, { useState, useEffect } from 'react';
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
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { IntegrationWorkflow, NodeType, IntegrationNode } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { DndProvider, useDrag, useDrop, DragSourceMonitor, DropTargetMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Template type with proper node structure
type IntegrationTemplate = {
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
};

// Example templates with proper node structure
const INTEGRATION_TEMPLATES: IntegrationTemplate[] = [
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
    id: 'data-warehouse',
    name: 'Data Warehouse ETL',
    description: 'Extract, transform, and load data into your warehouse with scheduled runs.',
    icon: <CloudArrowUpIcon className="w-6 h-6" />,
    category: 'Data Integration',
    complexity: 'Advanced',
    estimatedTime: '20 min',
    nodes: [
      {
        id: 'extract',
        serviceId: 'extract',
        position: { x: 100, y: 100 },
        data: {
          label: 'Extract',
          type: 'source',
          icon: 'database',
          connected: false,
          config: {}
        }
      },
      {
        id: 'transform',
        serviceId: 'transform',
        position: { x: 300, y: 100 },
        data: {
          label: 'Transform',
          type: 'transform',
          icon: 'code',
          connected: false,
          config: {}
        }
      },
      {
        id: 'load',
        serviceId: 'warehouse',
        position: { x: 500, y: 100 },
        data: {
          label: 'Load',
          type: 'destination',
          icon: 'warehouse',
          connected: false,
          config: {}
        }
      }
    ]
  },
  {
    id: 'api-integration',
    name: 'API Integration',
    description: 'Connect and orchestrate multiple APIs with automatic retries and error handling.',
    icon: <CubeTransparentIcon className="w-6 h-6" />,
    category: 'API Management',
    complexity: 'Simple',
    estimatedTime: '5 min',
    nodes: [
      {
        id: 'api1',
        serviceId: 'api',
        position: { x: 100, y: 100 },
        data: {
          label: 'API 1',
          type: 'source',
          icon: 'api',
          connected: false,
          config: {}
        }
      },
      {
        id: 'api2',
        serviceId: 'api',
        position: { x: 300, y: 100 },
        data: {
          label: 'API 2',
          type: 'destination',
          icon: 'api',
          connected: false,
          config: {}
        }
      }
    ]
  }
] as const;

// Keyboard shortcuts configuration
const SHORTCUTS = {
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
const EMPTY_TEMPLATE: IntegrationTemplate = {
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
      className={`group cursor-pointer bg-white border border-cco-neutral-200 rounded-xl p-6 hover:shadow-md transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{
        boxShadow: isDragging ? '0 20px 25px -5px rgb(0 0 0 / 0.1)' : undefined
      }}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div 
            className="flex items-center justify-center w-12 h-12 rounded-full bg-cco-primary-100 text-cco-primary-600"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {template.icon}
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-cco-neutral-900 group-hover:text-cco-primary-600 transition-colors">
              {template.name}
            </h3>
            <span className="text-xs font-medium text-cco-neutral-500">
              {template.category}
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-cco-neutral-600 mb-4">
        {template.description}
      </p>
      
      <div className="flex items-center justify-between text-xs">
        <span className="px-2 py-1 rounded-full bg-cco-neutral-100 text-cco-neutral-700">
          {template.complexity}
        </span>
        <span className="text-cco-neutral-500">
          ⏱️ {template.estimatedTime}
        </span>
      </div>

      {/* Node Preview */}
      <div className="mt-4 pt-4 border-t border-cco-neutral-100">
        <div className="flex items-center space-x-2">
          {template.nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              <motion.div 
                className="px-2 py-1 rounded bg-cco-neutral-50 text-xs text-cco-neutral-700"
                whileHover={{ scale: 1.1 }}
              >
                {node.data.label}
              </motion.div>
              {index < template.nodes.length - 1 && (
                <motion.div 
                  className="w-4 h-4 text-cco-neutral-400"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ChevronRightIcon />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
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

export default function MyCOOPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<IntegrationWorkflow | null>(null);
  const [mode, setMode] = useState<'list' | 'edit'>('list');
  const [showKeyboardTips, setShowKeyboardTips] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<IntegrationTemplate | null>(null);
  const [draggedTemplate, setDraggedTemplate] = useState(null);
  
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
                <div>
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
                        <p className="text-cco-neutral-700">
                          Connect your third-party data providers to enhance your CCO's cognitive capabilities.
                        </p>
                        <p className="text-sm text-cco-neutral-600">
                          Your data will be securely processed and integrated into your second brain, providing valuable insights during meetings, 
                          enriching project context, and helping you make more informed decisions. Choose from our pre-built templates or create a custom connection.
                        </p>
                      </>
                    ) : (
                      <p className="text-cco-neutral-600">
                        {selectedTemplate.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {selectedTemplate && (
                    <motion.button 
                      onClick={handleBackToList}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-cco-neutral-100 text-cco-neutral-700 rounded-md hover:bg-cco-neutral-200 transition-colors"
                    >
                      Back to Templates
                    </motion.button>
                  )}
                  <button
                    onClick={() => setShowKeyboardTips(prev => !prev)}
                    className="p-2 text-cco-neutral-600 hover:text-cco-neutral-900 hover:bg-cco-neutral-100 rounded-md transition-colors"
                    title="Show Keyboard Shortcuts"
                  >
                    <CommandLineIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="bg-white rounded-xl p-6">
              {!selectedTemplate ? (
                <div className="space-y-6">
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    layout
                  >
                    {/* Empty Template Card */}
                    <motion.div 
                      onClick={() => {
                        setSelectedTemplate(EMPTY_TEMPLATE);
                        setMode('edit');
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group cursor-pointer bg-white border-2 border-dashed border-cco-neutral-200 rounded-xl p-6 hover:border-cco-primary-500 hover:bg-cco-primary-50 transition-all"
                    >
                      <motion.div 
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-cco-neutral-100 group-hover:bg-white mb-4"
                        whileHover={{ rotate: 180 }}
                      >
                        <PlusIcon className="w-6 h-6 text-cco-neutral-600 group-hover:text-cco-primary-600" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-cco-neutral-900 mb-2">Connect a Data Provider</h3>
                      <p className="text-sm text-cco-neutral-600">
                        Set up a custom connection to your preferred data storage service or API.
                      </p>
                    </motion.div>

                    {/* Template Cards */}
                    <AnimatePresence>
                      {INTEGRATION_TEMPLATES.map((template) => (
                        <DraggableTemplateCard
                          key={template.id}
                          template={template}
                          onSelect={() => {
                            setSelectedTemplate(template);
                            setMode('edit');
                          }}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
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
          </motion.div>
        </DndProvider>
      </DashboardLayout>
    </>
  );
} 