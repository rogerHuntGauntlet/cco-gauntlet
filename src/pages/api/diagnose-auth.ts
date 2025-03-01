import { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../utils/supabaseClient';

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
    let dbStatus: { connected: boolean; error: string | null } = { 
      connected: false, 
      error: null 
    };
    
    try {
      const { error } = await supabase
        .from('_test_connection')
        .select('*')
        .limit(1);
      
      dbStatus = {
        connected: !error,
        error: error ? error.message : null
      };
    } catch (err) {
      dbStatus = {
        connected: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      };
    }

    // Test auth service
    let authStatus: { 
      operational: boolean; 
      error: string | null;
      responseTime?: string;
      slow?: boolean;
    } = { 
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

    // Get network information
    const clientIp = req.headers['x-forwarded-for'] || 
                     req.socket.remoteAddress || 
                     'Unknown';

    // Create a diagnostic report
    const diagnosticReport: {
      status: string;
      timestamp: string;
      environment: any;
      infrastructure: any;
      client: any;
      recommendations: string[];
    } = {
      status: 'success',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        variables: envStatus
      },
      infrastructure: {
        database: dbStatus,
        auth: authStatus
      },
      client: {
        userAgent,
        type: isBrowser ? 'browser' : isBot ? 'bot' : isMobile ? 'mobile' : 'unknown',
        ip: typeof clientIp === 'string' ? clientIp.split(',')[0].trim() : clientIp,
        cookies: {
          present: !!req.headers.cookie,
          count: req.headers.cookie ? req.headers.cookie.split(';').length : 0
        }
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