import { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../utils/supabaseClient';

// Define interfaces for our diagnostic report types
interface EnvStatus {
  exists: boolean;
  value: string | null;
}

interface DbStatus {
  connected: boolean;
  error: string | null;
  responseTime?: string;
  slow?: boolean;
}

interface AuthStatus {
  operational: boolean;
  error: string | null;
  responseTime?: string;
  slow?: boolean;
}

interface CookieDiagnostics {
  present: boolean;
  count: number;
  authCookiesFound: boolean;
  specificCookies: {
    name: string;
    found: boolean;
  }[];
}

interface DiagnosticReport {
  status: string;
  timestamp: string;
  environment: {
    nodeEnv: string;
    variables: {
      supabaseUrl: EnvStatus;
      supabaseAnonKey: EnvStatus;
    };
  };
  infrastructure: {
    database: DbStatus;
    auth: AuthStatus;
  };
  client: {
    userAgent: string;
    type: string;
    ip: string;
    cookies: CookieDiagnostics;
    potentialIssues: string[];
  };
  recommendations: string[];
}

// List of expected auth cookies
const EXPECTED_AUTH_COOKIES = [
  'sb-access-token', 
  'sb-refresh-token',
  'supabase-auth-token'
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check environment variables
    const envStatus = {
      supabaseUrl: {
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        value: process.env.NEXT_PUBLIC_SUPABASE_URL ? 
          `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 10)}...` : null
      },
      supabaseAnonKey: {
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
          `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...` : null
      }
    };

    // Test database connectivity
    let dbStatus: DbStatus = { 
      connected: false, 
      error: null 
    };
    
    try {
      const startDb = Date.now();
      const { error } = await supabase
        .from('_test_connection')
        .select('*')
        .limit(1);
      const responseTime = Date.now() - startDb;
      
      dbStatus = {
        connected: !error,
        error: error ? error.message : null,
        responseTime: `${responseTime}ms`,
        slow: responseTime > 500
      };
    } catch (err) {
      dbStatus = {
        connected: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      };
    }

    // Test auth service
    let authStatus: AuthStatus = { 
      operational: false, 
      error: null 
    };
    
    try {
      const start = Date.now();
      const { error } = await supabase.auth.getSession();
      const responseTime = Date.now() - start;
      
      authStatus = {
        operational: !error,
        responseTime: `${responseTime}ms`,
        error: error ? error.message : null,
        slow: responseTime > 1000
      };
    } catch (err) {
      authStatus = {
        operational: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      };
    }

    // Try to get the user agent details
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const isBrowser = !!userAgent.match(/(chrome|safari|firefox|edge|opera)/i);
    const isBot = !!userAgent.match(/(bot|crawler|spider)/i);
    const isMobile = !!userAgent.match(/(android|iphone|ipad|mobile)/i);
    
    // Check specific browsers known to have third-party cookie issues
    const isSafari = !!userAgent.match(/safari/i) && !userAgent.match(/chrome/i);
    const isFirefox = !!userAgent.match(/firefox/i);
    const isChrome = !!userAgent.match(/chrome/i);
    const isEdge = !!userAgent.match(/edg/i);

    // Get network information
    const clientIp = req.headers['x-forwarded-for'] || 
                     req.socket.remoteAddress || 
                     'Unknown';
                     
    // Check cookies
    const cookieHeader = req.headers.cookie || '';
    const cookieCount = cookieHeader ? cookieHeader.split(';').length : 0;
    const allCookies = cookieHeader.split(';').map(c => c.trim().split('=')[0]);
    
    // Check for expected authentication cookies
    const foundAuthCookies = EXPECTED_AUTH_COOKIES.filter(cookieName => 
      allCookies.some(c => c.includes(cookieName))
    );
    
    const cookieDiagnostics: CookieDiagnostics = {
      present: cookieCount > 0,
      count: cookieCount,
      authCookiesFound: foundAuthCookies.length > 0,
      specificCookies: EXPECTED_AUTH_COOKIES.map(name => ({
        name,
        found: allCookies.some(c => c.includes(name))
      }))
    };
    
    // Identify potential browser-specific issues
    const potentialIssues: string[] = [];
    
    if (isSafari) {
      potentialIssues.push("Safari's Intelligent Tracking Prevention may block cookies");
    }
    
    if (isFirefox) {
      potentialIssues.push("Firefox's Enhanced Tracking Protection may block cookies");
    }
    
    if (isChrome) {
      potentialIssues.push("Chrome's Privacy features may block third-party cookies");
    }
    
    if (cookieCount === 0) {
      potentialIssues.push("No cookies detected - browser may be blocking cookies completely");
    }
    
    // Create a diagnostic report
    const diagnosticReport: DiagnosticReport = {
      status: 'success',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV || 'unknown',
        variables: envStatus
      },
      infrastructure: {
        database: dbStatus,
        auth: authStatus
      },
      client: {
        userAgent,
        type: isBrowser ? 'browser' : isBot ? 'bot' : isMobile ? 'mobile' : 'unknown',
        ip: typeof clientIp === 'string' ? clientIp.split(',')[0].trim() : Array.isArray(clientIp) ? clientIp[0] : String(clientIp),
        cookies: cookieDiagnostics,
        potentialIssues
      },
      recommendations: []
    };

    // Add recommendations based on findings
    if (!envStatus.supabaseUrl.exists || !envStatus.supabaseAnonKey.exists) {
      diagnosticReport.recommendations.push(
        'Check that Supabase environment variables are properly set in .env.local file'
      );
    }

    if (!dbStatus.connected) {
      diagnosticReport.recommendations.push(
        'Verify that your Supabase instance is running and accessible'
      );
    }

    if (!authStatus.operational) {
      diagnosticReport.recommendations.push(
        'Supabase Auth service is not responding correctly. Check your project settings in Supabase.'
      );
    }

    if (authStatus.slow) {
      diagnosticReport.recommendations.push(
        'Auth service is responding slowly, which might cause timeouts. This could be due to Supabase free tier limitations.'
      );
    }
    
    // Cookie-specific recommendations
    if (!cookieDiagnostics.present) {
      diagnosticReport.recommendations.push(
        'Your browser is not sending any cookies. Check your browser settings to allow cookies for this site.'
      );
    } else if (!cookieDiagnostics.authCookiesFound) {
      diagnosticReport.recommendations.push(
        'Authentication cookies are missing. Try clearing all browser cookies and sign in again.'
      );
    }
    
    // Browser-specific recommendations
    if (isSafari) {
      diagnosticReport.recommendations.push(
        'If using Safari, go to Preferences > Privacy > Website tracking and disable "Prevent cross-site tracking"'
      );
    }
    
    if (isFirefox) {
      diagnosticReport.recommendations.push(
        'If using Firefox, go to Settings > Privacy & Security and set Enhanced Tracking Protection to "Standard" instead of "Strict"'
      );
    }
    
    if (isChrome) {
      diagnosticReport.recommendations.push(
        'If using Chrome, make sure third-party cookies are enabled in Settings > Privacy and security > Cookies and other site data'
      );
    }
    
    // Return the diagnostic report
    return res.status(200).json(diagnosticReport);
  } catch (error) {
    console.error('Error in auth diagnosis:', error);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
} 