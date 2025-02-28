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
  SparklesIcon
} from '@heroicons/react/24/outline';
import { IntegrationWorkflow, NodeType, IntegrationNode } from '../../../types';

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
    id: 'data-sync',
    name: 'Data Sync Pipeline',
    description: 'Synchronize data between two systems in real-time with automatic conflict resolution.',
    icon: <ArrowPathRoundedSquareIcon className="w-6 h-6" />,
    category: 'Data Integration',
    complexity: 'Medium',
    estimatedTime: '10 min',
    nodes: [
      {
        id: 'source',
        serviceId: 'database',
        position: { x: 100, y: 100 },
        data: {
          label: 'Source DB',
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
        id: 'destination',
        serviceId: 'database',
        position: { x: 500, y: 100 },
        data: {
          label: 'Destination DB',
          type: 'destination',
          icon: 'database',
          connected: false,
          config: {}
        }
      }
    ]
  },
  {
    id: 'event-stream',
    name: 'Event Streaming',
    description: 'Process real-time events with a scalable streaming pipeline for analytics and monitoring.',
    icon: <BoltIcon className="w-6 h-6" />,
    category: 'Event Processing',
    complexity: 'Advanced',
    estimatedTime: '15 min',
    nodes: [
      {
        id: 'events',
        serviceId: 'events',
        position: { x: 100, y: 100 },
        data: {
          label: 'Event Source',
          type: 'source',
          icon: 'lightning',
          connected: false,
          config: {}
        }
      },
      {
        id: 'process',
        serviceId: 'process',
        position: { x: 300, y: 100 },
        data: {
          label: 'Process',
          type: 'transform',
          icon: 'processor',
          connected: false,
          config: {}
        }
      },
      {
        id: 'analyze',
        serviceId: 'analyze',
        position: { x: 500, y: 100 },
        data: {
          label: 'Analyze',
          type: 'destination',
          icon: 'chart',
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
    id: 'ml-pipeline',
    name: 'ML Model Pipeline',
    description: 'Deploy and monitor machine learning models with automated retraining.',
    icon: <SparklesIcon className="w-6 h-6" />,
    category: 'Machine Learning',
    complexity: 'Advanced',
    estimatedTime: '25 min',
    nodes: [
      {
        id: 'data',
        serviceId: 'data',
        position: { x: 100, y: 100 },
        data: {
          label: 'Data',
          type: 'source',
          icon: 'database',
          connected: false,
          config: {}
        }
      },
      {
        id: 'train',
        serviceId: 'train',
        position: { x: 300, y: 100 },
        data: {
          label: 'Train',
          type: 'transform',
          icon: 'brain',
          connected: false,
          config: {}
        }
      },
      {
        id: 'deploy',
        serviceId: 'deploy',
        position: { x: 500, y: 100 },
        data: {
          label: 'Deploy',
          type: 'destination',
          icon: 'cloud',
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

export default function MyCOOPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<StrictIntegrationWorkflow | null>(null);
  const [mode, setMode] = useState<'list' | 'edit' | 'create'>('list');
  const [showKeyboardTips, setShowKeyboardTips] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<IntegrationTemplate | null>(null);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key) {
        case SHORTCUTS.CREATE_WORKFLOW:
          handleCreateNew();
          break;
        case SHORTCUTS.TOGGLE_TIPS:
          setShowTips(prev => !prev);
          break;
        case SHORTCUTS.FOCUS_SEARCH:
          e.preventDefault();
          document.getElementById('workflow-search')?.focus();
          break;
        case 'Escape':
          if (mode !== 'list') handleBackToList();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [mode]);

  const handleCreateNew = () => {
    setSelectedWorkflow(null);
    setMode('create');
  };
  
  const handleEditWorkflow = (workflow: IntegrationWorkflow) => {
    setSelectedWorkflow(workflow);
    setMode('edit');
  };
  
  const handleBackToList = () => {
    setMode('list');
  };

  const filteredWorkflows = integrationWorkflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
        <div className="space-y-6 relative">
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
                  <span className="text-cco-neutral-600">New Workflow</span>
                  <kbd className="px-2 py-1 bg-cco-neutral-100 rounded text-xs">n</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-cco-neutral-600">Toggle Tips</span>
                  <kbd className="px-2 py-1 bg-cco-neutral-100 rounded text-xs">t</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-cco-neutral-600">Search</span>
                  <kbd className="px-2 py-1 bg-cco-neutral-100 rounded text-xs">/</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-cco-neutral-600">Exit Editor</span>
                  <kbd className="px-2 py-1 bg-cco-neutral-100 rounded text-xs">esc</kbd>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-cco-neutral-900">My COO</h1>
                <p className="text-cco-neutral-700">
                  Manage your data integration workflows and connect to external services.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowKeyboardTips(prev => !prev)}
                  className="p-2 text-cco-neutral-600 hover:text-cco-neutral-900 hover:bg-cco-neutral-100 rounded-md transition-colors"
                  title="Show Keyboard Shortcuts"
                >
                  <CommandLineIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleCreateNew}
                  className="bg-cco-primary-600 text-white px-4 py-2 rounded-md hover:bg-cco-primary-700 transition-colors flex items-center"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create Workflow
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <input
                id="workflow-search"
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-cco-neutral-200 focus:outline-none focus:ring-2 focus:ring-cco-primary-500 focus:border-transparent"
              />
            </div>

            {/* Tips Section */}
            {showTips && (
              <div className="mb-6 bg-cco-primary-50 rounded-lg p-4 flex items-start space-x-3">
                <LightBulbIcon className="w-5 h-5 text-cco-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-cco-primary-900 mb-1">Pro Tips</h3>
                  <p className="text-sm text-cco-primary-700">
                    Press <kbd className="px-1.5 py-0.5 bg-white rounded text-xs">n</kbd> to create a new workflow, 
                    <kbd className="px-1.5 py-0.5 bg-white rounded text-xs ml-1">/</kbd> to search, and 
                    <kbd className="px-1.5 py-0.5 bg-white rounded text-xs ml-1">t</kbd> to toggle these tips.
                  </p>
                </div>
                <button 
                  onClick={() => setShowTips(false)}
                  className="text-cco-primary-600 hover:text-cco-primary-800"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          
          {/* Workflows Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredWorkflows.map((workflow) => (
              <div 
                key={workflow.id} 
                className="group bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-cco-neutral-900 group-hover:text-cco-primary-600 transition-colors">
                      {workflow.name}
                    </h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      workflow.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : workflow.status === 'paused'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-cco-neutral-700 mb-4">
                    {workflow.description}
                  </p>
                  
                  {/* Workflow Preview */}
                  <div className="bg-cco-neutral-50 rounded-lg p-4 mb-4 relative overflow-hidden group-hover:bg-cco-neutral-100 transition-colors">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-cco-primary-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-cco-primary-700">
                          {workflow.nodes[0]?.data.label?.charAt(0)}
                        </span>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-cco-neutral-400" />
                      <div className="flex-1 h-0.5 bg-cco-neutral-200 relative">
                        <div 
                          className="absolute inset-y-0 left-0 bg-cco-primary-500"
                          style={{ width: `${workflow.status === 'active' ? '100%' : '0%'}` }}
                        />
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-cco-neutral-400" />
                      <div className="w-8 h-8 rounded-full bg-cco-primary-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-cco-primary-700">
                          {workflow.nodes[workflow.nodes.length - 1]?.data.label?.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-cco-neutral-700">
                        <span className="font-medium">Source:</span> {workflow.nodes[0]?.data.label}
                      </span>
                      <span className="text-cco-neutral-700">
                        <span className="font-medium">Destination:</span> {workflow.nodes[workflow.nodes.length - 1]?.data.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-cco-neutral-600">
                    <span>Updated {new Date(workflow.updatedAt).toLocaleDateString()}</span>
                    <span>{workflow.nodes.length} nodes</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-cco-neutral-200">
                    <div className="flex space-x-2">
                      {workflow.status === 'active' ? (
                        <button 
                          className="p-2 text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors"
                          title="Pause Workflow"
                        >
                          <PauseIcon className="w-5 h-5" />
                        </button>
                      ) : (
                        <button 
                          className="p-2 text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
                          title="Start Workflow"
                        >
                          <PlayIcon className="w-5 h-5" />
                        </button>
                      )}
                      <button 
                        className="p-2 text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                        title="Refresh Workflow"
                      >
                        <ArrowPathIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleEditWorkflow(workflow)}
                      className="px-4 py-2 bg-cco-neutral-100 text-cco-neutral-700 rounded-md hover:bg-cco-neutral-200 transition-colors"
                    >
                      Edit Workflow
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Editor Modal */}
          {mode !== 'list' && (
            <div className="fixed inset-0 bg-black/20 z-40">
              <div className="absolute inset-4 bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-cco-neutral-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-cco-neutral-900">
                        {mode === 'create' ? 'Create New Workflow' : `Edit: ${selectedWorkflow?.name}`}
                      </h1>
                      <p className="text-cco-neutral-700">
                        {mode === 'create' 
                          ? 'Start with a template or create your own workflow from scratch.' 
                          : selectedWorkflow?.description}
                      </p>
                    </div>
                    <button 
                      onClick={handleBackToList}
                      className="bg-cco-neutral-100 text-cco-neutral-700 px-4 py-2 rounded-md hover:bg-cco-neutral-200 transition-colors"
                    >
                      Close Editor
                    </button>
                  </div>
                </div>
                
                <div className="h-[calc(100%-5rem)] p-6 overflow-y-auto">
                  {mode === 'create' && !selectedTemplate ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Empty Template Card */}
                      <div 
                        onClick={() => setSelectedTemplate(EMPTY_TEMPLATE)}
                        className="group cursor-pointer bg-white border-2 border-dashed border-cco-neutral-200 rounded-xl p-6 hover:border-cco-primary-500 hover:bg-cco-primary-50 transition-all"
                      >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cco-neutral-100 group-hover:bg-white mb-4">
                          <PlusIcon className="w-6 h-6 text-cco-neutral-600 group-hover:text-cco-primary-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-cco-neutral-900 mb-2">Start from Scratch</h3>
                        <p className="text-sm text-cco-neutral-600">
                          Create a custom workflow with your own nodes and connections.
                        </p>
                      </div>

                      {/* Template Cards */}
                      {INTEGRATION_TEMPLATES.map((template) => (
                        <div 
                          key={template.id}
                          onClick={() => setSelectedTemplate(template)}
                          className="group cursor-pointer bg-white border border-cco-neutral-200 rounded-xl p-6 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cco-primary-100 text-cco-primary-600">
                                {template.icon}
                              </div>
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

                          {/* Preview */}
                          <div className="mt-4 pt-4 border-t border-cco-neutral-100">
                            <div className="flex items-center space-x-2">
                              {template.nodes.map((node, index) => (
                                <React.Fragment key={node.id}>
                                  <div className="px-2 py-1 rounded bg-cco-neutral-50 text-xs text-cco-neutral-700">
                                    {node.data.label}
                                  </div>
                                  {index < template.nodes.length - 1 && (
                                    <ChevronRightIcon className="w-4 h-4 text-cco-neutral-400" />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <DataIntegrationNodeEditor 
                      workflow={selectedTemplate ? createWorkflowFromTemplate(selectedTemplate) : selectedWorkflow} 
                      mode={mode}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
} 