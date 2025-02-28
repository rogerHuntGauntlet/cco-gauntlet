import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  Connection,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { PlusIcon } from '@heroicons/react/24/outline';
import { IntegrationService, NodeType, IntegrationWorkflow } from '../../types';

// Define node types
const NODE_TYPES = {
  SOURCE: 'source' as NodeType,
  TRANSFORM: 'transform' as NodeType,
  DESTINATION: 'destination' as NodeType,
};

// Define integration service types
const INTEGRATION_SERVICES: IntegrationService[] = [
  { id: 'google-drive', name: 'Google Drive', type: NODE_TYPES.SOURCE, icon: '📄', description: 'Import files from Google Drive' },
  { id: 'dropbox', name: 'Dropbox', type: NODE_TYPES.SOURCE, icon: '📦', description: 'Import files from Dropbox' },
  { id: 'onedrive', name: 'OneDrive', type: NODE_TYPES.SOURCE, icon: '☁️', description: 'Import files from OneDrive' },
  { id: 'sharepoint', name: 'SharePoint', type: NODE_TYPES.SOURCE, icon: '📎', description: 'Import files from SharePoint' },
  { id: 'database', name: 'Database', type: NODE_TYPES.SOURCE, icon: '🗄️', description: 'Connect to a database' },
  { id: 'api', name: 'API', type: NODE_TYPES.SOURCE, icon: '🔌', description: 'Import data from an API' },
  { id: 'filter', name: 'Filter', type: NODE_TYPES.TRANSFORM, icon: '🔍', description: 'Filter incoming data' },
  { id: 'transform', name: 'Transform', type: NODE_TYPES.TRANSFORM, icon: '🔄', description: 'Transform data format' },
  { id: 'data-store', name: 'Data Store', type: NODE_TYPES.DESTINATION, icon: '💾', description: 'Store processed data' },
  { id: 'export', name: 'Export', type: NODE_TYPES.DESTINATION, icon: '📤', description: 'Export data to external service' },
];

interface CustomNodeProps {
  data: {
    label: string;
    icon: string;
    type: string;
    description?: string;
    connected?: boolean;
  };
}

// Custom node component
const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border border-cco-neutral-200 shadow-sm px-4 py-3 min-w-44">
      <div className="flex items-center">
        <span className="text-xl mr-2">{data.icon}</span>
        <div>
          <p className="font-medium text-cco-neutral-900">{data.label}</p>
          <p className="text-xs text-cco-neutral-600">{data.type}</p>
        </div>
      </div>
      {data.description && (
        <p className="text-xs text-cco-neutral-700 mt-1">{data.description}</p>
      )}
      {data.connected ? (
        <div className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
          Connected
        </div>
      ) : (
        <button className="mt-2 text-xs bg-cco-primary-100 text-cco-primary-700 px-2 py-1 rounded hover:bg-cco-primary-200 transition-colors">
          Configure
        </button>
      )}
    </div>
  );
};

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 100, y: 200 },
    data: { 
      label: 'Start Here',
      description: 'Add your first integration',
      icon: '🚀',
      type: 'Start',
    },
  },
];

const initialEdges: Edge[] = [];

interface DataIntegrationNodeEditorProps {
  workflow?: IntegrationWorkflow | null;
  mode: 'list' | 'edit' | 'create';
}

export function DataIntegrationNodeEditor({ workflow, mode }: DataIntegrationNodeEditorProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [showServiceMenu, setShowServiceMenu] = useState(false);
  
  // Load existing workflow if in edit mode
  useEffect(() => {
    if (mode === 'edit' && workflow) {
      // Convert workflow nodes to ReactFlow nodes
      const flowNodes: Node[] = workflow.nodes.map((node) => ({
        id: node.id,
        type: 'default',
        position: node.position,
        data: node.data,
      }));
      
      // Convert workflow edges to ReactFlow edges
      const flowEdges: Edge[] = workflow.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: edge.animated,
      }));
      
      setNodes(flowNodes);
      setEdges(flowEdges);
    } else if (mode === 'create') {
      // Reset to initial state for new workflow
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [workflow, mode]);
  
  // Handle node changes
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // Handle edge changes
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Handle connections
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    []
  );

  // Add a new node
  const addNode = (service: IntegrationService) => {
    const newNode: Node = {
      id: `node-${nodes.length + 1}`,
      type: 'default',
      position: {
        x: Math.random() * 300 + 100,
        y: Math.random() * 200 + 100,
      },
      data: {
        label: service.name,
        icon: service.icon,
        type: service.type,
        description: service.description,
        connected: false,
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    setShowServiceMenu(false);
  };

  // Group services by type for better organization in the menu
  const sourceServices = INTEGRATION_SERVICES.filter(s => s.type === NODE_TYPES.SOURCE);
  const transformServices = INTEGRATION_SERVICES.filter(s => s.type === NODE_TYPES.TRANSFORM);
  const destinationServices = INTEGRATION_SERVICES.filter(s => s.type === NODE_TYPES.DESTINATION);

  return (
    <div className="h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={{ default: CustomNode }}
        fitView
      >
        <Background color="#f0f0f0" gap={16} />
        <Controls />
        
        <Panel position="top-right">
          <div className="relative">
            <button
              className="bg-cco-primary-600 text-white p-2 rounded-full shadow-md hover:bg-cco-primary-700 transition-colors"
              onClick={() => setShowServiceMenu(!showServiceMenu)}
              aria-label="Add integration node"
            >
              <PlusIcon className="w-6 h-6" />
            </button>
            
            {showServiceMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-cco-neutral-200 z-10">
                <div className="p-3 border-b border-cco-neutral-200">
                  <h3 className="font-medium text-cco-neutral-900">Add Integration Service</h3>
                </div>
                
                <div className="max-h-72 overflow-y-auto p-2">
                  {/* Data Sources */}
                  <div className="mb-2">
                    <h4 className="text-xs font-semibold text-cco-neutral-600 mb-1 px-2">DATA SOURCES</h4>
                    {sourceServices.map((service) => (
                      <button
                        key={service.id}
                        className="flex items-center w-full text-left p-2 hover:bg-cco-neutral-100 rounded-md transition-colors"
                        onClick={() => addNode(service)}
                      >
                        <span className="text-xl mr-2">{service.icon}</span>
                        <div>
                          <p className="font-medium text-cco-neutral-900">{service.name}</p>
                          <p className="text-xs text-cco-neutral-600">{service.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Transformations */}
                  <div className="mb-2">
                    <h4 className="text-xs font-semibold text-cco-neutral-600 mb-1 px-2">TRANSFORMATIONS</h4>
                    {transformServices.map((service) => (
                      <button
                        key={service.id}
                        className="flex items-center w-full text-left p-2 hover:bg-cco-neutral-100 rounded-md transition-colors"
                        onClick={() => addNode(service)}
                      >
                        <span className="text-xl mr-2">{service.icon}</span>
                        <div>
                          <p className="font-medium text-cco-neutral-900">{service.name}</p>
                          <p className="text-xs text-cco-neutral-600">{service.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Destinations */}
                  <div>
                    <h4 className="text-xs font-semibold text-cco-neutral-600 mb-1 px-2">DESTINATIONS</h4>
                    {destinationServices.map((service) => (
                      <button
                        key={service.id}
                        className="flex items-center w-full text-left p-2 hover:bg-cco-neutral-100 rounded-md transition-colors"
                        onClick={() => addNode(service)}
                      >
                        <span className="text-xl mr-2">{service.icon}</span>
                        <div>
                          <p className="font-medium text-cco-neutral-900">{service.name}</p>
                          <p className="text-xs text-cco-neutral-600">{service.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
} 