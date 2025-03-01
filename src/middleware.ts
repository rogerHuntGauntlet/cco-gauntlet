import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// This middleware handles authentication redirects
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  try {
    // Get the pathname from the URL
    const { pathname, searchParams } = req.nextUrl
    
    // Check for debug bypass parameter - only for development environment
    const hasDebugBypass = searchParams.has('debugBypass') && 
                         process.env.NODE_ENV === 'development';
    
    // Add debug headers if in development
    if (process.env.NODE_ENV === 'development') {
      res.headers.set('X-Auth-Debug', 'Middleware-Active');
      // Log all cookies for debugging
      console.log('[Auth Middleware] Cookies:', req.cookies.getAll());
    }
    
    // Get Supabase environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Validation check to avoid creating client with invalid credentials
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[Auth Middleware] Missing Supabase credentials');
      // Add debug headers if in development
      if (process.env.NODE_ENV === 'development') {
        res.headers.set('X-Auth-Error', 'Missing-Supabase-Credentials');
      }
      // Redirect to error page if not on signin/register pages
      if (!pathname.startsWith('/landing/signin') && !pathname.startsWith('/landing/register')) {
        return NextResponse.redirect(new URL('/landing/signin?error=config', req.url));
      }
      return res;
    }
    
    // Create a Supabase client configured to use cookies
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get: (name) => {
            try {
              const cookie = req.cookies.get(name);
              if (process.env.NODE_ENV === 'development') {
                console.log(`[Auth Middleware] Reading cookie ${name}:`, cookie?.value ? 'present' : 'not found');
              }
              return cookie?.value;
            } catch (e) {
              console.error('[Auth Middleware] Error reading cookie:', e);
              return undefined;
            }
          },
          set: (name, value, options) => {
            try {
              if (process.env.NODE_ENV === 'development') {
                console.log(`[Auth Middleware] Setting cookie ${name}`, options);
              }
              
              // Ensure path is set
              const cookieOptions = {
                ...options,
                path: options?.path || '/'
              };
              
              // Don't set domain for localhost to avoid cookie issues
              if (req.headers.get('host')?.includes('localhost') && cookieOptions.domain) {
                delete cookieOptions.domain;
              }
              
              res.cookies.set({
                name,
                value,
                ...cookieOptions
              });
            } catch (e) {
              console.error('[Auth Middleware] Error setting cookie:', e);
            }
          },
          remove: (name, options) => {
            try {
              if (process.env.NODE_ENV === 'development') {
                console.log(`[Auth Middleware] Removing cookie ${name}`);
              }
              
              // Ensure path is set
              const cookieOptions = {
                ...options,
                path: options?.path || '/'
              };
              
              // Don't set domain for localhost to avoid cookie issues
              if (req.headers.get('host')?.includes('localhost') && cookieOptions.domain) {
                delete cookieOptions.domain;
              }
              
              res.cookies.set({
                name,
                value: '',
                ...cookieOptions,
                maxAge: 0
              });
            } catch (e) {
              console.error('[Auth Middleware] Error removing cookie:', e);
            }
          },
        },
        cookieOptions: {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        }
      }
    )
    
    // Get session with robust error handling
    let session = null;
    let sessionError = null;
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        // Log error but continue flow as unauthenticated
        console.error('[Auth Middleware] Error getting session:', error.message);
        sessionError = error;
      } else {
        session = data.session;
        if (process.env.NODE_ENV === 'development' && session) {
          console.log('[Auth Middleware] Session found, user:', session.user.email);
        } else if (process.env.NODE_ENV === 'development') {
          console.log('[Auth Middleware] No session found');
        }
      }
    } catch (sessionError) {
      console.error('[Auth Middleware] Failed to get session:', 
        sessionError instanceof Error ? sessionError.message : 'Unknown error');
    }
    
    // Add additional debug headers in development
    if (process.env.NODE_ENV === 'development') {
      res.headers.set('X-Auth-Status', session ? 'Authenticated' : 'Unauthenticated');
      res.headers.set('X-Auth-Cookie-Count', String(req.cookies.getAll().length));
      if (sessionError) {
        res.headers.set('X-Auth-Error', 'Session-Error');
      }
    }
    
    // Define protected routes that require authentication
    const isProtectedRoute = 
      pathname.startsWith('/dashboard') || 
      pathname.startsWith('/landing/onboarding');
    
    // Define authentication routes
    const isAuthRoute = 
      pathname.startsWith('/landing/signin') || 
      pathname.startsWith('/landing/register');
    
    // If the user is accessing a protected route but isn't authenticated, redirect to signin
    if (isProtectedRoute && !session) {
      // Allow bypassing login in development environment with debugBypass parameter
      if (hasDebugBypass && process.env.NODE_ENV === 'development') {
        console.log('[Auth Middleware] Development bypass: Allowing access to protected route');
        return NextResponse.next();
      }
      
      const redirectUrl = new URL('/landing/signin', req.url);
      
      // Add the original URL as a parameter to redirect after login
      redirectUrl.searchParams.set('redirectTo', pathname);
      
      // If there was a session error, add it to the URL for debugging
      if (sessionError && process.env.NODE_ENV === 'development') {
        redirectUrl.searchParams.set('sessionError', 'true');
      }
      
      // Preserve any additional query parameters from the original request
      Array.from(searchParams.entries()).forEach(([key, value]) => {
        if (key !== 'redirectTo' && key !== 'sessionError') {
          redirectUrl.searchParams.append(key, value);
        }
      });
      
      return NextResponse.redirect(redirectUrl);
    }
    
    // If the user is authenticated but accessing auth routes, redirect to dashboard
    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    // Always redirect authenticated users to the dashboard if they're trying to visit the root page
    if (pathname === '/' && session) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } catch (error) {
    // Log unexpected errors in the middleware
    console.error('[Auth Middleware] Unexpected error:', 
      error instanceof Error ? error.message : 'Unknown error');
    
    // Add debug headers in development
    if (process.env.NODE_ENV === 'development') {
      res.headers.set('X-Auth-Critical-Error', 'Middleware-Exception');
    }
  }

  // For other cases, proceed as normal
  return res;
}

// Configure paths that should be checked by the middleware
export const config = {
  matcher: [
    // Root path
    '/',
    // Dashboard routes (protected)
    '/dashboard/:path*',
    // Auth routes 
    '/landing/signin',
    '/landing/register',
    '/landing/onboarding',
    // Add callback route to be processed by middleware
    '/auth/callback',
  ],
} 