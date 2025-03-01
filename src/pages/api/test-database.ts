import { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../utils/supabaseClient';

interface TableResult {
  exists: boolean;
  count: number;
  error: string | null;
}

interface TableData {
  data: any[] | null;
  error: string | null;
}

interface TableResults {
  [key: string]: TableResult;
}

interface TableDataResults {
  [key: string]: TableData;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Test auth connection
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    // Test tables by checking their existence
    const tables = [
      'cco_profiles',
      'cco_notifications',
      'cco_projects',
      'cco_meetings',
      'cco_participants',
      'cco_action_items',
      'cco_documents'
    ];
    
    const tableResults: TableResults = {};
    
    for (const table of tables) {
      // Try to get a count of rows in each table
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
        
      tableResults[table] = {
        exists: !error,
        count: count || 0,
        error: error ? error.message : null
      };
    }
    
    // Get data from each table (limit to 5 rows per table)
    const tableData: TableDataResults = {};
    
    for (const table of tables) {
      if (tableResults[table].exists) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(5);
          
        tableData[table] = {
          data: data,
          error: error ? error.message : null
        };
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'Database connection test completed',
      auth: {
        connected: !authError,
        session: authData?.session ? 'Valid session' : 'No active session',
        error: authError ? authError.message : null
      },
      tables: tableResults,
      sampleData: tableData
    });
  } catch (error: unknown) {
    console.error('Database test error:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 