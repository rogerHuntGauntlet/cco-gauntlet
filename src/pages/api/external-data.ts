/**
 * API route for receiving external data
 * This replaces the Supabase Edge Function
 */

import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  success: boolean;
  message: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Validate API key
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.EXTERNAL_SERVICE_API_KEY;
    
    if (!apiKey || apiKey !== validApiKey) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or missing API key' 
      });
    }

    // Get request body
    const data = req.body;
    
    // Validate data
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No data provided' 
      });
    }

    // Process and store data
    // This is where you would replace Supabase storage with your preferred database
    console.log('Received external data:', data);
    
    // For demonstration, just echo the data back
    // In a real implementation, you would store this in your database
    return res.status(200).json({
      success: true,
      message: 'Data received successfully',
      data: {
        id: `data_${Date.now()}`,
        received_at: new Date().toISOString(),
        ...data
      }
    });
    
  } catch (error) {
    console.error('Error processing external data:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
} 