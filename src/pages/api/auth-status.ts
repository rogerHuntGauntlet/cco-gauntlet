import { NextApiRequest, NextApiResponse } from 'next';
import supabase, { SupabaseClient } from '../../utils/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check Supabase connection first
    const connectionTest = await testSupabaseConnection();
    
    // Check auth service status
    const authStatus = await testAuthService();
    
    // Get current session info (if any)
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    // Attempt to get the Supabase URL (don't expose full URL in logs/responses)
    const supabaseInfo = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 
        `${process.env.NEXT_PUBLIC_SUPABASE_URL.split('//')[0]}//******.supabase.co` : 
        'Not configured',
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      keyConfigured: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'REPLACE_AFTER_ROTATION'
    };
    
    return res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      supabaseInfo,
      database: connectionTest,
      auth: {
        serviceStatus: authStatus,
        session: {
          exists: !!sessionData.session,
          user: sessionData.session ? {
            id: sessionData.session.user.id,
            email: sessionData.session.user.email,
            lastSignIn: sessionData.session.user.last_sign_in_at
          } : null,
          error: sessionError ? {
            message: sessionError.message,
            status: sessionError.status || 'unknown'
          } : null
        }
      },
      clientInfo: {
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
      },
      diagnostics: {
        nodeVersion: process.version,
        environment: process.env.NODE_ENV,
        cookiesPresent: !!req.headers.cookie,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('[Auth Status API] Error:', error);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

// Test basic database connectivity
async function testSupabaseConnection() {
  try {
    const { data, error, status } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1);
      
    if (error) {
      return {
        connected: false,
        error: {
          message: error.message,
          code: error.code,
          details: error.details
        }
      };
    }
    
    return {
      connected: true,
      status,
      data: data && data.length > 0 ? 'Data available' : 'No data found'
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown database error'
    };
  }
}

// Test auth service specifically
async function testAuthService() {
  try {
    // A low-risk auth operation that doesn't modify anything
    const start = Date.now();
    const { data, error } = await supabase.auth.getSession();
    const responseTime = Date.now() - start;
    
    if (error) {
      return {
        operational: false,
        error: {
          message: error.message,
          status: error.status || 'unknown'
        }
      };
    }
    
    return {
      operational: true,
      responseTime: `${responseTime}ms`,
      performanceIssue: responseTime > 1000 ? 'Slow response detected' : false
    };
  } catch (error) {
    return {
      operational: false,
      error: error instanceof Error ? error.message : 'Unknown auth service error'
    };
  }
} 