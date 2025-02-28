export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'vibecoder' | 'admin';
  avatar?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number; // in minutes
  participants: User[];
  projectId: string;
  recordingUrl?: string;
  transcriptUrl?: string;
  status: 'scheduled' | 'completed' | 'canceled';
  summary?: string;
  keyHighlights?: string[];
  actionItems?: ActionItem[];
  documents?: Document[];
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo?: string;
  dueDate?: string;
  status: 'open' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface Document {
  id: string;
  title: string;
  type: 'prd' | 'meeting_notes' | 'code_scaffold' | 'requirements' | 'other';
  createdAt: string;
  updatedAt: string;
  content: string;
  tags?: string[];
  status: 'draft' | 'review' | 'final';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  vibecoderId?: string;
  status: 'new' | 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
  meetings: Meeting[];
  documents: Document[];
  tags?: string[];
}

export interface Recommendation {
  id: string;
  type: 'code' | 'design' | 'process' | 'communication';
  content: string;
  context: string;
  timestamp: string;
  relevant: boolean;
  implemented?: boolean;
}

export interface Dashboard {
  recentMeetings: Meeting[];
  upcomingMeetings: Meeting[];
  activeProjects: Project[];
  recentDocuments: Document[];
  pendingActionItems: ActionItem[];
}

export interface MeetingInsight {
  meetingId: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  keyTakeaways: string[];
  clientFeedback?: string;
  clientEngagement: number; // 0-100 scale
  followUpRecommendations: string[];
}

// Integration Types
export type NodeType = 'source' | 'transform' | 'destination';

export interface IntegrationService {
  id: string;
  name: string;
  type: NodeType;
  icon: string;
  description?: string;
  configOptions?: IntegrationConfigOption[];
}

export interface IntegrationConfigOption {
  id: string;
  name: string;
  type: 'text' | 'select' | 'boolean' | 'file';
  required: boolean;
  options?: string[];
  defaultValue?: string | boolean;
}

export interface IntegrationWorkflow {
  id: string;
  name: string;
  description?: string;
  nodes: IntegrationNode[];
  edges: IntegrationEdge[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
}

export interface IntegrationNode {
  id: string;
  serviceId: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    type: NodeType;
    icon: string;
    connected: boolean;
    config?: Record<string, any>;
  };
}

export interface IntegrationEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  label?: string;
} 