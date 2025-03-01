/**
 * Authentication client to replace Supabase
 * Uses API routes for auth operations
 */

export type User = {
  id: string;
  email: string;
  role?: string;
};

export type Session = {
  access_token: string;
  expires_at: number; // Unix timestamp
  user: User;
};

export type AuthError = {
  message: string;
  status?: number;
};

// Authentication helpers
export const signIn = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/auth?action=signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: {
          message: result.error || 'Failed to sign in',
          status: response.status
        }
      };
    }

    return { 
      data: { 
        session: result.session,
        user: result.user
      }, 
      error: null 
    };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 500
      }
    };
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/auth?action=signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: {
          message: result.error || 'Failed to sign up',
          status: response.status
        }
      };
    }

    return { 
      data: { 
        user: result.user 
      }, 
      error: null 
    };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 500
      }
    };
  }
};

export const signOut = async () => {
  try {
    const response = await fetch('/api/auth?action=signout', {
      method: 'POST',
    });

    if (!response.ok) {
      const result = await response.json();
      return {
        error: {
          message: result.error || 'Failed to sign out',
          status: response.status
        }
      };
    }

    return { error: null };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 500
      }
    };
  }
};

export const getUser = async () => {
  try {
    const sessionResult = await getSession();
    
    if (sessionResult.error || !sessionResult.data.session) {
      return { data: { user: null }, error: null };
    }
    
    return { data: { user: sessionResult.data.session.user }, error: null };
  } catch (error) {
    return {
      data: { user: null },
      error: {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 500
      }
    };
  }
};

export const getSession = async () => {
  try {
    const response = await fetch('/api/auth?action=session', {
      method: 'GET',
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        data: { session: null },
        error: {
          message: result.error || 'Failed to get session',
          status: response.status
        }
      };
    }

    return { data: { session: result.session }, error: null };
  } catch (error) {
    return {
      data: { session: null },
      error: {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 500
      }
    };
  }
};

export const signInWithProvider = async (provider: 'discord' | 'github' | 'gitlab' | 'google') => {
  // In a real implementation, this would redirect to the OAuth provider
  console.log(`Would redirect to ${provider} for OAuth login`);
  
  return {
    data: null,
    error: {
      message: `OAuth with ${provider} is not implemented in this demo version.`
    }
  };
};

export const resetPassword = async (email: string) => {
  // Simulate password reset email
  console.log(`Would send password reset email to ${email}`);
  
  return { error: null };
};

// Default export for compatibility with existing code
const auth = {
  auth: {
    signIn,
    signUp,
    signOut,
    getUser,
    getSession,
    onAuthStateChange: (callback: any) => {
      // No implementation for now
      return { unsubscribe: () => {} };
    }
  }
};

export default auth; 