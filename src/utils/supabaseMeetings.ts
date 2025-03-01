import supabase from './supabaseClient';

export interface Meeting {
  id?: string;
  title: string;
  description?: string;
  user_id: string;
  project_id?: string;
  date: string;
  duration?: number; // duration in minutes
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  meeting_link?: string;
  meeting_provider?: string; // e.g., 'zoom', 'google_meet', 'teams'
  participants?: string[]; // array of participant emails or IDs
  created_at?: string;
  updated_at?: string;
}

export interface MeetingNote {
  id?: string;
  meeting_id: string;
  user_id: string;
  content: string; // Markdown content of the note
  is_ai_generated: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ActionItem {
  id?: string;
  meeting_id: string;
  description: string;
  assigned_to?: string;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at?: string;
  updated_at?: string;
}

/**
 * Get all meetings for a user
 */
export const getUserMeetings = async (userId: string) => {
  const { data, error } = await supabase
    .from('cco_meetings')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  return { meetings: data as Meeting[] | null, error };
};

/**
 * Get meetings for a specific project
 */
export const getProjectMeetings = async (projectId: string) => {
  const { data, error } = await supabase
    .from('cco_meetings')
    .select('*')
    .eq('project_id', projectId)
    .order('date', { ascending: false });

  return { meetings: data as Meeting[] | null, error };
};

/**
 * Get a single meeting by ID
 */
export const getMeeting = async (meetingId: string) => {
  const { data, error } = await supabase
    .from('cco_meetings')
    .select('*')
    .eq('id', meetingId)
    .single();

  return { meeting: data as Meeting | null, error };
};

/**
 * Create a new meeting
 */
export const createMeeting = async (meeting: Meeting) => {
  const { data, error } = await supabase
    .from('cco_meetings')
    .insert(meeting)
    .select()
    .single();

  return { meeting: data as Meeting | null, error };
};

/**
 * Update a meeting
 */
export const updateMeeting = async (meetingId: string, updates: Partial<Meeting>) => {
  const { data, error } = await supabase
    .from('cco_meetings')
    .update(updates)
    .eq('id', meetingId)
    .select()
    .single();

  return { meeting: data as Meeting | null, error };
};

/**
 * Delete a meeting
 */
export const deleteMeeting = async (meetingId: string) => {
  const { error } = await supabase
    .from('cco_meetings')
    .delete()
    .eq('id', meetingId);

  return { error };
};

/**
 * Get all notes for a meeting
 */
export const getMeetingNotes = async (meetingId: string) => {
  const { data, error } = await supabase
    .from('cco_meeting_notes')
    .select('*')
    .eq('meeting_id', meetingId)
    .order('created_at', { ascending: true });

  return { notes: data as MeetingNote[] | null, error };
};

/**
 * Create a new meeting note
 */
export const createMeetingNote = async (note: MeetingNote) => {
  const { data, error } = await supabase
    .from('cco_meeting_notes')
    .insert(note)
    .select()
    .single();

  return { note: data as MeetingNote | null, error };
};

/**
 * Update a meeting note
 */
export const updateMeetingNote = async (noteId: string, updates: Partial<MeetingNote>) => {
  const { data, error } = await supabase
    .from('cco_meeting_notes')
    .update(updates)
    .eq('id', noteId)
    .select()
    .single();

  return { note: data as MeetingNote | null, error };
};

/**
 * Get all action items for a meeting
 */
export const getMeetingActionItems = async (meetingId: string) => {
  const { data, error } = await supabase
    .from('cco_action_items')
    .select('*')
    .eq('meeting_id', meetingId)
    .order('created_at', { ascending: true });

  return { actionItems: data as ActionItem[] | null, error };
};

/**
 * Create a new action item
 */
export const createActionItem = async (actionItem: ActionItem) => {
  const { data, error } = await supabase
    .from('cco_action_items')
    .insert(actionItem)
    .select()
    .single();

  return { actionItem: data as ActionItem | null, error };
};

/**
 * Update an action item
 */
export const updateActionItem = async (actionItemId: string, updates: Partial<ActionItem>) => {
  const { data, error } = await supabase
    .from('cco_action_items')
    .update(updates)
    .eq('id', actionItemId)
    .select()
    .single();

  return { actionItem: data as ActionItem | null, error };
};

/**
 * Mark an action item as completed
 */
export const completeActionItem = async (actionItemId: string) => {
  return await updateActionItem(actionItemId, { status: 'completed' });
};

const supabaseMeetingsApi = {
  getUserMeetings,
  getProjectMeetings,
  getMeeting,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getMeetingNotes,
  createMeetingNote,
  updateMeetingNote,
  getMeetingActionItems,
  createActionItem,
  updateActionItem,
  completeActionItem
};

export default supabaseMeetingsApi; 