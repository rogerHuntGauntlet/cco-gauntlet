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
    
    // Create a Supabase client configured to use cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => req.cookies.get(name)?.value,
          set: (name, value, options) => {
            res.cookies.set({ name, value, ...options })
          },
          remove: (name, options) => {
            res.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    // Get session with robust error handling
    let session = null;
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        // Log error but continue flow as unauthenticated
        console.error('[Auth Middleware] Error getting session:', error.message);
      } else {
        session = data.session;
      }
    } catch (sessionError) {
      console.error('[Auth Middleware] Failed to get session:', 
        sessionError instanceof Error ? sessionError.message : 'Unknown error');
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
      
      // Preserve any additional query parameters from the original request
      Array.from(searchParams.entries()).forEach(([key, value]) => {
        if (key !== 'redirectTo') {
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
  ],
} 