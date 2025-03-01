/// <reference lib="deno.ns" />

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface LLMResponse {
  project: {
    name: string;
    description: string;
    client_id?: string;
    vibecoder_id?: string;
    status: 'new' | 'active' | 'paused' | 'completed';
    tags?: string[];
  };
  prd: {
    title: string;
    content: string;
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Method not allowed. Only POST requests are supported.'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405 
        }
      );
    }

    // Extract API key from request headers
    const apiKey = req.headers.get('x-api-key');
    
    // Get environment variables
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const EXTERNAL_SERVICE_API_KEY = Deno.env.get('EXTERNAL_SERVICE_API_KEY') || '';
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';
    
    // Validate API key
    if (!apiKey || apiKey !== EXTERNAL_SERVICE_API_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Unauthorized. Invalid or missing API key.'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Validate OpenAI API key
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Server configuration error: Missing OpenAI API key.'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse request body as JSON
    const data = await req.json();
    
    // Basic validation
    if (!data || Object.keys(data).length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Bad request. Request body is empty or invalid.'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Validate source is provided
    if (!data.source) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Bad request. Source field is required.'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Extract client IP address
    let clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    // If multiple IPs, get the first one
    if (clientIp.includes(',')) {
      clientIp = clientIp.split(',')[0].trim();
    }

    // Store the data in Supabase external_data table
    const { data: insertedData, error: insertError } = await supabase
      .from('external_data')
      .insert([
        {
          source: data.source,
          data: data, // Store the entire payload in the data JSONB field
          received_at: new Date().toISOString(),
          status: 'processing',
          metadata: {
            ip: clientIp,
            user_agent: req.headers.get('user-agent'),
            content_type: req.headers.get('content-type')
          }
        }
      ])
      .select();

    if (insertError) {
      console.error('Error storing data in Supabase:', insertError);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to store initial data',
          error: insertError.message
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    // Prepare data for LLM
    const prompt = `
    You are an AI assistant that helps create software projects and product requirement documents (PRDs).
    Based on the following input, please create:
    1. A project object with name, description, status (set to 'new'), and relevant tags
    2. A PRD markdown document that outlines the requirements for this project
    
    The response should be a valid JSON object with two properties:
    - "project": an object with properties matching the cco_projects table (name, description, status, tags as string array)
    - "prd": an object with "title" and "content" (markdown text) properties
    
    Here is the input data:
    ${JSON.stringify(data, null, 2)}
    
    Respond ONLY with the JSON object, no explanations or other text.
    `;

    // Call OpenAI API
    try {
      const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!openAIResponse.ok) {
        const errorData = await openAIResponse.json();
        throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
      }

      const llmResponseData = await openAIResponse.json();
      const llmContent = llmResponseData.choices[0]?.message?.content;
      
      if (!llmContent) {
        throw new Error('Empty response from LLM');
      }

      // Parse the LLM response
      const llmResponse = JSON.parse(llmContent) as LLMResponse;
      
      // Validate project object 
      if (!llmResponse.project || !llmResponse.project.name || !llmResponse.prd) {
        throw new Error('Invalid response format from LLM');
      }

      // Insert the project into cco_projects
      const { data: projectData, error: projectError } = await supabase
        .from('cco_projects')
        .insert([{
          name: llmResponse.project.name,
          description: llmResponse.project.description,
          client_id: llmResponse.project.client_id,
          vibecoder_id: llmResponse.project.vibecoder_id,
          status: llmResponse.project.status || 'new',
          tags: llmResponse.project.tags || []
        }])
        .select();

      if (projectError) {
        throw new Error(`Failed to create project: ${projectError.message}`);
      }

      const projectId = projectData[0].id;

      // Insert the PRD into cco_documents
      const { data: docData, error: docError } = await supabase
        .from('cco_documents')
        .insert([{
          title: llmResponse.prd.title,
          type: 'prd',
          content: llmResponse.prd.content,
          project_id: projectId,
          status: 'draft',
          tags: llmResponse.project.tags || []
        }])
        .select();

      if (docError) {
        throw new Error(`Failed to create PRD document: ${docError.message}`);
      }

      // Update the external_data status to completed
      if (insertedData && insertedData[0]) {
        await supabase
          .from('external_data')
          .update({ status: 'completed' })
          .eq('id', insertedData[0].id);
      }

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Project and PRD created successfully',
          data: {
            project: projectData[0],
            document: docData[0]
          },
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    } catch (llmError) {
      console.error('Error processing with LLM:', llmError);
      
      // Update the external_data status to failed
      if (insertedData && insertedData[0]) {
        await supabase
          .from('external_data')
          .update({ 
            status: 'failed',
            metadata: {
              ...insertedData[0].metadata,
              error: llmError instanceof Error ? llmError.message : String(llmError)
            }
          })
          .eq('id', insertedData[0].id);
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to process data with LLM',
          error: llmError instanceof Error ? llmError.message : String(llmError)
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
    
  } catch (err) {
    console.error('Unexpected error processing external data:', err);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: err instanceof Error ? err.message : String(err)
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}); 