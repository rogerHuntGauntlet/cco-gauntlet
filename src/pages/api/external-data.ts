import { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../utils/supabaseClient';

/**
 * API endpoint for receiving data from external services
 * 
 * This endpoint allows external services to send data to our application.
 * Authentication is required via API key in the request headers.
 * 
 * @param req The Next.js API request
 * @param res The Next.js API response
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Only POST requests are supported.'
    });
  }

  try {
    // Validate API key from headers
    const apiKey = req.headers['x-api-key'] as string;
    
    // TODO: Replace with your actual API key validation logic
    if (!apiKey || apiKey !== process.env.EXTERNAL_SERVICE_API_KEY) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Invalid or missing API key.'
      });
    }

    // Get the data from the request body
    const data = req.body;
    
    // Basic validation
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Bad request. Request body is empty or invalid.'
      });
    }

    // Validate source is provided
    if (!data.source) {
      return res.status(400).json({
        success: false,
        message: 'Bad request. Source field is required.'
      });
    }

    // Log the received data (for debugging purposes)
    console.log(`Received data from external service: ${data.source}`, data);

    // Store the data in Supabase external_data table
    const { data: insertedData, error } = await supabase
      .from('external_data')
      .insert([
        {
          source: data.source,
          data: data, // Store the entire payload in the data JSONB field
          received_at: new Date().toISOString(),
          status: 'pending',
          metadata: {
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            user_agent: req.headers['user-agent'],
            content_type: req.headers['content-type']
          }
        }
      ]);

    if (error) {
      console.error('Error storing data in Supabase:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to store data',
        error: error.message
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Data received and stored successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (err) {
    console.error('Unexpected error processing external data:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err instanceof Error ? err.message : String(err)
    });
  }
} 