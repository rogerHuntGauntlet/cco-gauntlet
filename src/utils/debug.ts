import supabase from './supabaseClient';

// Flag to prevent multiple initializations
let bypassInitialized = false;

/**
 * Special function to force authentication for development/debugging
 * Never use this in production as it completely bypasses security!
 */
export const initializeAuthenticationBypass = async () => {
  // Prevent multiple initializations
  if (bypassInitialized) {
    console.log('🔒 Authentication bypass already initialized, skipping...');
    return { success: true };
  }
  
  console.log('⚠️ INITIALIZING AUTH BYPASS - FOR DEVELOPMENT ONLY ⚠️');
  
  try {
    // First ensure we're in a browser context
    if (typeof window === 'undefined') {
      console.error('❌ Cannot run authentication bypass in server context');
      return { success: false, error: 'Server-side context detected' };
    }
    
    // Create the hardcoded user for consistent data
    const hardcodedUser = {
      id: 'a12fdb05-d08e-4fb4-b0fc-a29d123e08b4',
      email: 'data@ideatrek.io',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(), 
      last_sign_in_at: new Date().toISOString(),
      role: 'authenticated',
      app_metadata: { provider: 'email' },
      user_metadata: {}
    };
    
    // Create a hardcoded session
    const hardcodedSession = {
      access_token: 'debug_' + Date.now().toString(),
      refresh_token: 'debug_refresh_' + Date.now().toString(),
      user: hardcodedUser,
      expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
    };
    
    console.log('🔑 Setting up hardcoded authentication data...');
    
    // Set localStorage values
    try {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: hardcodedSession,
        expiresAt: Date.now() + 3600000 // 1 hour from now in milliseconds
      }));
      
      console.log('✅ LocalStorage auth values set');
    } catch (e) {
      console.warn('⚠️ Could not set localStorage values:', e);
    }
    
    // Set cookies for auth
    try {
      document.cookie = `sb-access-token=${hardcodedSession.access_token}; path=/; max-age=3600`;
      document.cookie = `sb-refresh-token=${hardcodedSession.refresh_token}; path=/; max-age=3600`;
      console.log('✅ Auth cookies set');
    } catch (e) {
      console.warn('⚠️ Could not set auth cookies:', e);
    }
    
    // Flag method monkey-patching for debugging only
    const DEBUG_MONKEY_PATCHING = true;
    
    // If allowed, try to monkey-patch critical auth methods
    // Warning: This is very hacky and should only be used as a last resort for debugging
    if (DEBUG_MONKEY_PATCHING) {
      try {
        console.log('🛠️ Attempting to monkey-patch auth methods (extreme approach)...');
        
        // Monitor and intercept auth API calls
        const originalFetch = window.fetch;
        window.fetch = function(input, init) {
          // String conversion for URL compatibility
          const url = input.toString();
          
          // Intercept Supabase auth API calls
          if (url.includes('/auth/v1/') || url.includes('supabase.co')) {
            console.log('🔍 Intercepted fetch to:', url);
            
            // Handle token refresh endpoints
            if (url.includes('/token')) {
              console.log('🔄 Auth token request intercepted, returning fake session');
              return Promise.resolve(new Response(JSON.stringify({
                access_token: hardcodedSession.access_token,
                refresh_token: hardcodedSession.refresh_token,
                user: hardcodedUser,
                expires_in: 3600,
                expires_at: hardcodedSession.expires_at
              }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
            }
            
            // Handle session validation endpoints
            if (url.includes('/user') && init?.headers) {
              console.log('👤 User validation request intercepted, returning fake user');
              return Promise.resolve(new Response(JSON.stringify(hardcodedUser), 
                { status: 200, headers: { 'Content-Type': 'application/json' } }));
            }
          }
          
          // Pass through all other requests
          return originalFetch.apply(this, arguments);
        };
        
        console.log('✅ Network interception initialized');
      } catch (e) {
        console.warn('⚠️ Failed to set up network interception:', e);
      }
    }
    
    // Set up a flag indicating the bypass is active
    bypassInitialized = true;
    window.__AUTH_BYPASS_ACTIVE = true;
    console.log('🚀 Authentication bypass initialized successfully!');
    
    return { success: true };
  } catch (e) {
    console.error('❌ Fatal error in authentication bypass:', e);
    return { success: false, error: e instanceof Error ? e.message : String(e) };
  }
};

// Debug function to perform a auth status check
export const checkAuthBypassStatus = async () => {
  try {
    // Try to get the session using the normal method
    const sessionResult = await supabase.auth.getSession();
    
    // Check if we have a session from our bypass
    const hasSession = !!sessionResult.data?.session;
    const userInfo = sessionResult.data?.session?.user;
    
    console.log('🔍 Auth bypass check - Session present:', hasSession);
    if (userInfo) {
      console.log('👤 Current user:', userInfo.email, '(ID:', userInfo.id, ')');
    }
    
    return {
      bypassActive: hasSession,
      success: hasSession,
      sessionInfo: sessionResult.data?.session ? {
        userId: sessionResult.data.session.user.id,
        email: sessionResult.data.session.user.email,
        expires: new Date(sessionResult.data.session.expires_at * 1000).toLocaleString()
      } : null
    };
  } catch (e) {
    console.error('❌ Error checking auth bypass status:', e);
    return { bypassActive: false, success: false, error: String(e) };
  }
}; 