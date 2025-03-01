import { supabase } from './supabaseClient';
import { 
  User, 
  Meeting, 
  Project, 
  Document, 
  ActionItem, 
  Notification 
} from '../types';

/**
 * Get all notifications for a user
 */
export const getNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('cco_notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { 
    notifications: data as Notification[] || [], 
    error 
  };
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  const { data, error } = await supabase
    .from('cco_notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .select()
    .single();
  
  return { 
    notification: data as Notification | null, 
    error 
  };
};

/**
 * Get projects for a user
 */
export const getProjects = async (userId: string) => {
  const { data, error } = await supabase
    .from('cco_projects')
    .select(`
      *,
      cco_meetings(*)
    `)
    .or(`client_id.eq.${userId},vibecoder_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  
  // Transform the data to match our Project interface
  const projects = data?.map(project => ({
    id: project.id,
    name: project.name,
    description: project.description,
    clientId: project.client_id,
    vibecoderId: project.vibecoder_id,
    status: project.status,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    meetings: project.cco_meetings || [],
    documents: [], // We'll fetch documents separately if needed
    tags: project.tags
  })) as Project[];
  
  return { 
    projects: projects || [], 
    error 
  };
};

/**
 * Get meetings for a user
 */
export const getMeetings = async (userId: string) => {
  const { data, error } = await supabase
    .from('cco_meetings')
    .select(`
      *,
      cco_participants(*)
    `)
    .order('date', { ascending: true });
  
  // Filter meetings where user is a participant
  const filteredMeetings = data?.filter(meeting => 
    meeting.cco_participants?.some((participant: { user_id: string }) => participant.user_id === userId)
  );
  
  // Transform the data to match our Meeting interface
  const meetings = filteredMeetings?.map(meeting => ({
    id: meeting.id,
    title: meeting.title,
    date: meeting.date,
    duration: meeting.duration,
    participants: meeting.cco_participants || [],
    projectId: meeting.project_id,
    recordingUrl: meeting.recording_url,
    transcriptUrl: meeting.transcript_url,
    status: meeting.status,
    summary: meeting.summary,
    keyHighlights: meeting.key_highlights,
    actionItems: [], // We'll fetch action items separately if needed
    documents: [] // We'll fetch documents separately if needed
  })) as Meeting[];
  
  return { 
    meetings: meetings || [], 
    error 
  };
};

/**
 * Get action items for a user
 */
export const getActionItems = async (userId: string) => {
  const { data, error } = await supabase
    .from('cco_action_items')
    .select('*')
    .eq('assigned_to', userId)
    .order('due_date', { ascending: true });
  
  return { 
    actionItems: data as ActionItem[] || [], 
    error 
  };
};

/**
 * Get documents for a project
 */
export const getDocuments = async (projectId: string) => {
  const { data, error } = await supabase
    .from('cco_documents')
    .select('*')
    .eq('project_id', projectId)
    .order('updated_at', { ascending: false });
  
  return { 
    documents: data as Document[] || [], 
    error 
  };
};

/**
 * Get unread notification count for a user
 */
export const getUnreadNotificationCount = async (userId: string) => {
  const { data, error } = await supabase
    .from('cco_notifications')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('is_read', false);
  
  return { 
    count: data?.length || 0, 
    error 
  };
}; 