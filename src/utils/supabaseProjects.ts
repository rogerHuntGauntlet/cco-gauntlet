import { supabase } from './supabaseClient';

export interface Project {
  id?: string;
  name: string;
  description?: string;
  user_id: string;
  team_id?: string;
  status?: 'planning' | 'active' | 'completed' | 'archived';
  start_date?: string;
  end_date?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ProjectMember {
  id?: string;
  project_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  added_at?: string;
}

/**
 * Get all projects for a user
 */
export const getUserProjects = async (userId: string) => {
  const { data, error } = await supabase
    .from('cco_projects')
    .select('*')
    .or(`user_id.eq.${userId},cco_project_members(user_id).eq.${userId}`)
    .order('created_at', { ascending: false });

  return { projects: data as Project[] | null, error };
};

/**
 * Get a single project by ID
 */
export const getProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from('cco_projects')
    .select('*')
    .eq('id', projectId)
    .single();

  return { project: data as Project | null, error };
};

/**
 * Create a new project
 */
export const createProject = async (project: Project) => {
  const { data, error } = await supabase
    .from('cco_projects')
    .insert(project)
    .select()
    .single();

  return { project: data as Project | null, error };
};

/**
 * Update a project
 */
export const updateProject = async (projectId: string, updates: Partial<Project>) => {
  const { data, error } = await supabase
    .from('cco_projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single();

  return { project: data as Project | null, error };
};

/**
 * Delete a project
 */
export const deleteProject = async (projectId: string) => {
  const { error } = await supabase
    .from('cco_projects')
    .delete()
    .eq('id', projectId);

  return { error };
};

/**
 * Get all members of a project
 */
export const getProjectMembers = async (projectId: string) => {
  const { data, error } = await supabase
    .from('cco_project_members')
    .select('*, cco_profiles:user_id(*)')
    .eq('project_id', projectId);

  return { members: data, error };
};

/**
 * Add a member to a project
 */
export const addProjectMember = async (member: ProjectMember) => {
  const { data, error } = await supabase
    .from('cco_project_members')
    .insert(member)
    .select()
    .single();

  return { member: data, error };
};

/**
 * Update a project member's role
 */
export const updateProjectMemberRole = async (projectId: string, userId: string, role: ProjectMember['role']) => {
  const { data, error } = await supabase
    .from('cco_project_members')
    .update({ role })
    .match({ project_id: projectId, user_id: userId })
    .select()
    .single();

  return { member: data, error };
};

/**
 * Remove a member from a project
 */
export const removeProjectMember = async (projectId: string, userId: string) => {
  const { error } = await supabase
    .from('cco_project_members')
    .delete()
    .match({ project_id: projectId, user_id: userId });

  return { error };
};

export default {
  getUserProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectMembers,
  addProjectMember,
  updateProjectMemberRole,
  removeProjectMember
}; 