import { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test the Supabase connection
    const { data, error } = await supabase.from('_test_connection').select('*').limit(1);
    
    if (error) {
      console.error('Supabase connection test error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to connect to Supabase',
        error 
      });
    }
    
    // Test the Supabase auth service is working
    const authResponse = await supabase.auth.getSession();
    
    return res.status(200).json({
      success: true,
      message: 'Supabase connection test successful',
      dbData: data,
      authStatus: authResponse.error ? 'Error' : 'Working',
      authResponse: authResponse.error ? { error: authResponse.error } : { session: !!authResponse.data.session }
    });
  } catch (err) {
    console.error('Unexpected error in Supabase test:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Unexpected error testing Supabase connection',
      error: err instanceof Error ? err.message : String(err)
    });
  }
} 