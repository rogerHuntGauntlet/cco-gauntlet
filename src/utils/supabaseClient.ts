import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { type AuthError } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// Export the SupabaseClient type for use in other files
export type { SupabaseClient };

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create a single supabase client for the entire app
let supabase: SupabaseClient;

// Different client initialization based on environment
if (typeof window !== 'undefined') {
  // Browser environment - use SSR for better browser compatibility
  supabase = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get: (name) => {
          try {
            return document.cookie
              .split('; ')
              .find((row) => row.startsWith(`${name}=`))
              ?.split('=')[1];
          } catch (e) {
            console.error('Error getting cookie:', e);
            return undefined;
          }
        },
        set: (name, value, options) => {
          try {
            let cookieString = `${name}=${value}`;
            if (options) {
              Object.entries(options).forEach(([key, val]) => {
                cookieString += `; ${key}=${val}`;
              });
            }
            document.cookie = cookieString;
          } catch (e) {
            console.error('Error setting cookie:', e);
          }
        },
        remove: (name, options) => {
          try {
            let cookieString = `${name}=; max-age=0`;
            if (options) {
              Object.entries(options).forEach(([key, val]) => {
                cookieString += `; ${key}=${val}`;
              });
            }
            document.cookie = cookieString;
          } catch (e) {
            console.error('Error removing cookie:', e);
          }
        },
      },
      cookieOptions: { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      },
      // Fix for some browsers blocking third-party cookies
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  );
} else {
  // Server environment
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

// Authentication helpers with improved error handling
export const signIn = async (email: string, password: string) => {
  // Number of retries for auth operations
  const MAX_RETRIES = 2;
  const TIMEOUT_DURATION = 15000; // 15 seconds timeout - increased for slower connections
  
  // Clear any existing sessions or cookies that might be interfering
  try {
    // Clear browser cookies related to auth
    if (typeof window !== 'undefined') {
      const authCookies = ['sb-access-token', 'sb-refresh-token', 'supabase-auth-token'];
      authCookies.forEach(cookieName => {
        document.cookie = `${cookieName}=; max-age=0; path=/; domain=${window.location.hostname}`;
      });
    }
  } catch (e) {
    console.warn('Could not clear existing auth cookies:', e);
  }
  
  // Implement retry logic with exponential backoff
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        // Wait with exponential backoff before retrying (1s, then 2s)
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        console.log(`Retrying sign-in attempt ${attempt}/${MAX_RETRIES}...`);
      }
      
      // Create a timeout promise
      let timeoutId: NodeJS.Timeout;
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`Authentication request timed out after ${TIMEOUT_DURATION/1000} seconds`));
        }, TIMEOUT_DURATION);
      });
      
      // Actual auth request
      const authPromise = supabase.auth.signInWithPassword({ email, password })
        .then(result => {
          clearTimeout(timeoutId);
          return result;
        });
      
      // Race the sign in against the timeout
      const { data, error } = await Promise.race([authPromise, timeoutPromise]);
      
      // If we got a successful response
      if (data && data.session && !error) {
        console.log('Authentication successful, session established');
        
        // Force a refresh of the session to ensure cookies are set properly
        await supabase.auth.refreshSession();
        
        return { data, error: null };
      }
      
      if (error) {
        // Check if this is a server error that warrants a retry
        if (error.status && error.status >= 500 && attempt < MAX_RETRIES) {
          console.warn(`Server error (${error.status}), will retry...`);
          continue; // Try again
        }
        
        // Provide more user-friendly error messages
        if (error.message === 'Database error granting user' || 
            error.message?.includes('Service unavailable') ||
            error.message?.includes('Authentication service')) {
          return {
            data: null,
            error: {
              ...error,
              message: 'Authentication service is currently unavailable. Please try again later.'
            }
          };
        } else if (error.message?.includes('Invalid login credentials')) {
          return {
            data: null,
            error: {
              ...error,
              message: 'Invalid email or password. Please check your credentials and try again.'
            }
          };
        }
        
        // For other errors, return as is
        return { data, error };
      }
      
      return { data, error };
      
    } catch (e) {
      console.error('Error during sign in:', e);
      
      // If this isn't the last attempt, try again
      if (attempt < MAX_RETRIES) {
        continue;
      }
      
      // If we've exhausted retries, return the error
      return { 
        data: null, 
        error: {
          message: e instanceof Error ? 
            e.message : 
            'Authentication failed. Please try again later.',
          status: 500,
          code: 'internal_error'
        } as AuthError
      };
    }
  }
  
  // This should not be reached due to the returns in the loop,
  // but TypeScript requires a return statement
  return {
    data: null,
    error: {
      message: 'Authentication failed after multiple attempts',
      status: 500,
      code: 'max_retries_exceeded'
    } as AuthError
  };
};

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    // Provide more specific error messages
    if (error) {
      if (error.message?.includes('User already registered')) {
        return {
          data: null,
          error: {
            ...error,
            message: 'An account with this email already exists. Please try signing in instead.'
          }
        };
      }
    }
    
    return { data, error };
  } catch (e) {
    return { 
      data: null, 
      error: {
        message: e instanceof Error ? e.message : 'Sign up failed',
        status: 500,
        code: 'internal_error'
      } as AuthError
    };
  }
};

export const signOut = async () => {
  try {
    // Use the supabase client to sign out - this will handle cookies properly
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (e) {
    return { 
      error: {
        message: e instanceof Error ? e.message : 'Sign out failed',
        status: 500,
        code: 'internal_error'
      } as AuthError
    };
  }
};

export const signInWithProvider = async (provider: 'discord' | 'github' | 'gitlab' | 'google') => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      },
    });
    
    return { data, error };
  } catch (e) {
    return { 
      data: null, 
      error: {
        message: e instanceof Error ? e.message : 'Social sign in failed',
        status: 500,
        code: 'internal_error'
      } as AuthError
    };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/landing/reset-password`,
    });
    return { data, error };
  } catch (e) {
    return { 
      data: null,
      error: {
        message: e instanceof Error ? e.message : 'Password reset failed',
        status: 500,
        code: 'internal_error'
      } as AuthError
    };
  }
};

export const getUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  } catch (e) {
    return { 
      user: null,
      error: {
        message: e instanceof Error ? e.message : 'Failed to get user',
        status: 500,
        code: 'internal_error'
      } as AuthError
    };
  }
};

export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  } catch (e) {
    return { 
      session: null,
      error: {
        message: e instanceof Error ? e.message : 'Failed to get session',
        status: 500,
        code: 'internal_error'
      } as AuthError
    };
  }
};

// Export default for convenience
export default supabase as SupabaseClient; 