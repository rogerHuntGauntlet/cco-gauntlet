import { supabase } from './supabaseClient';

// Define types for profile data
export interface UserProfile {
  id?: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  role?: string;
  preferences?: UserPreferences;
  created_at?: string;
  updated_at?: string;
}

export interface UserPreferences {
  notification_frequency?: 'daily' | 'weekly' | 'never';
  data_privacy?: 'private' | 'team' | 'public';
  ai_suggestions?: boolean;
  theme?: 'light' | 'dark' | 'system';
}

/**
 * Get a user's profile by their user ID
 */
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('cco_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { profile: data as UserProfile | null, error };
};

/**
 * Create or update a user's profile
 */
export const upsertProfile = async (profile: UserProfile) => {
  const { data, error } = await supabase
    .from('cco_profiles')
    .upsert(profile, { onConflict: 'user_id' })
    .select()
    .single();

  return { profile: data as UserProfile | null, error };
};

/**
 * Update specific fields of a user's profile
 */
export const updateProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('cco_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  return { profile: data as UserProfile | null, error };
};

/**
 * Update a user's preferences
 */
export const updatePreferences = async (userId: string, preferences: UserPreferences) => {
  const { data, error } = await supabase
    .from('cco_profiles')
    .update({ preferences })
    .eq('user_id', userId)
    .select()
    .single();

  return { profile: data as UserProfile | null, error };
};

/**
 * Upload a profile avatar image
 */
export const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('cco-user-content')
    .upload(filePath, file);

  if (uploadError) {
    return { error: uploadError };
  }

  // Get the public URL
  const { data } = supabase.storage
    .from('cco-user-content')
    .getPublicUrl(filePath);

  // Update the user's profile with the new avatar URL
  const { profile, error } = await updateProfile(userId, {
    avatar_url: data.publicUrl
  });

  return { profile, error };
};

/**
 * Delete a user's profile
 */
export const deleteProfile = async (userId: string) => {
  const { error } = await supabase
    .from('cco_profiles')
    .delete()
    .eq('user_id', userId);

  return { error };
};

export default {
  getProfile,
  upsertProfile,
  updateProfile,
  updatePreferences,
  uploadAvatar,
  deleteProfile
}; 