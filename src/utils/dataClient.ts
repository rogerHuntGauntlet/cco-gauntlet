/**
 * Data client to replace Supabase for data operations
 * This is a simple in-memory implementation for demonstration purposes
 * You should replace this with your preferred database solution
 */

// Define types for each table
type Profile = {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
};

type Project = {
  id: string;
  name: string;
  description: string;
  owner_id: string;
};

type Meeting = {
  id: string;
  project_id: string;
  title: string;
  scheduled_at: string;
};

type Notification = {
  id: string;
  user_id: string;
  message: string;
  read: boolean;
};

// Mock data store with proper typing
const mockData: {
  profiles: Profile[];
  projects: Project[];
  meetings: Meeting[];
  notifications: Notification[];
} = {
  profiles: [
    { id: '1', user_id: '1', full_name: 'Test User', avatar_url: null }
  ],
  projects: [
    { id: '1', name: 'Project 1', description: 'Test project 1', owner_id: '1' }
  ],
  meetings: [
    { id: '1', project_id: '1', title: 'Kickoff Meeting', scheduled_at: new Date().toISOString() }
  ],
  notifications: [
    { id: '1', user_id: '1', message: 'Welcome to the platform!', read: false }
  ]
};

type Table = keyof typeof mockData;
type DataRecord = Record<string, any>;

/**
 * Generic function to fetch data from the mock database
 */
export const fetchData = async <T = any>(
  table: Table,
  filter?: Record<string, any>
): Promise<{ data: T[] | null; error: null | { message: string } }> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const tableData = mockData[table];
    
    let result = [...tableData];
    
    // Apply filters if provided
    if (filter) {
      result = result.filter(item => {
        return Object.entries(filter).every(([key, value]) => item[key as keyof typeof item] === value);
      });
    }
    
    return { data: result as T[], error: null };
  } catch (error) {
    return { data: null, error: { message: (error as Error).message } };
  }
};

/**
 * Insert a record into the mock database
 */
export const insertData = async <T = any>(
  table: Table,
  data: DataRecord
): Promise<{ data: T | null; error: null | { message: string } }> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const id = `${Date.now()}`;
    const newRecord = { id, ...data } as any;
    
    mockData[table].push(newRecord);
    
    return { data: newRecord as T, error: null };
  } catch (error) {
    return { data: null, error: { message: (error as Error).message } };
  }
};

/**
 * Update a record in the mock database
 */
export const updateData = async <T = any>(
  table: Table,
  id: string,
  data: DataRecord
): Promise<{ data: T | null; error: null | { message: string } }> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const index = mockData[table].findIndex(item => item.id === id);
    
    if (index === -1) {
      return { data: null, error: { message: `Record with id ${id} not found in table ${table}` } };
    }
    
    const updatedRecord = { ...mockData[table][index], ...data } as any;
    mockData[table][index] = updatedRecord;
    
    return { data: updatedRecord as T, error: null };
  } catch (error) {
    return { data: null, error: { message: (error as Error).message } };
  }
};

/**
 * Delete a record from the mock database
 */
export const deleteData = async (
  table: Table,
  id: string
): Promise<{ error: null | { message: string } }> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const index = mockData[table].findIndex(item => item.id === id);
    
    if (index === -1) {
      return { error: { message: `Record with id ${id} not found in table ${table}` } };
    }
    
    mockData[table].splice(index, 1);
    
    return { error: null };
  } catch (error) {
    return { error: { message: (error as Error).message } };
  }
};

// Specific data functions to match previous Supabase utilities

// Profiles
export type UserProfile = Profile;

export const getProfile = async (userId: string): Promise<{ data: UserProfile | null; error: null | { message: string } }> => {
  const { data, error } = await fetchData<UserProfile>('profiles', { user_id: userId });
  
  if (error || !data?.length) {
    return { data: null, error: error || { message: 'Profile not found' } };
  }
  
  return { data: data[0], error: null };
};

// Projects
export { type Project };

export const getProjects = async (userId: string): Promise<{ data: Project[] | null; error: null | { message: string } }> => {
  return fetchData<Project>('projects', { owner_id: userId });
};

// Notifications
export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  const { data } = await fetchData<Notification>('notifications', { user_id: userId, read: false });
  return data?.length || 0;
};

// Default export for compatibility
const dataClient = {
  from: (table: Table) => ({
    select: () => ({
      eq: (field: string, value: any) => ({
        then: async (callback: (data: any) => void) => {
          const { data, error } = await fetchData(table, { [field]: value });
          callback({ data, error });
        }
      }),
      then: async (callback: (data: any) => void) => {
        const { data, error } = await fetchData(table);
        callback({ data, error });
      }
    }),
    insert: (data: DataRecord) => ({
      then: async (callback: (data: any) => void) => {
        const result = await insertData(table, data);
        callback(result);
      }
    }),
    update: (data: DataRecord) => ({
      eq: (field: string, value: any) => ({
        then: async (callback: (data: any) => void) => {
          // Find the record first
          const { data: found } = await fetchData(table, { [field]: value });
          if (found?.length) {
            const result = await updateData(table, found[0].id, data);
            callback(result);
          } else {
            callback({ data: null, error: { message: 'Record not found' } });
          }
        }
      })
    }),
    delete: () => ({
      eq: (field: string, value: any) => ({
        then: async (callback: (data: any) => void) => {
          // Find the record first
          const { data: found } = await fetchData(table, { [field]: value });
          if (found?.length) {
            const result = await deleteData(table, found[0].id);
            callback(result);
          } else {
            callback({ error: { message: 'Record not found' } });
          }
        }
      })
    })
  })
};

export default dataClient; 