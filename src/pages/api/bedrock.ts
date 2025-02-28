import { NextApiRequest, NextApiResponse } from 'next';
import { 
  BedrockRuntimeClient, 
  InvokeModelCommand 
} from '@aws-sdk/client-bedrock-runtime';
import { fromEnv } from '@aws-sdk/credential-providers';

// Initialize the BedrockRuntimeClient
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: fromEnv(),
});

// Default model ID
const DEFAULT_MODEL = process.env.DEFAULT_BEDROCK_MODEL || 'anthropic.claude-3-7-sonnet-20250219-v1:0';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      prompt, 
      modelId, 
      maxTokens, 
      temperature, 
      topK, 
      topP, 
      stopSequences 
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Use provided model ID or default
    const model = modelId || DEFAULT_MODEL;
    
    // Create request body based on model
    let body: any;
    
    if (model.includes('anthropic.claude')) {
      // Format for Claude models
      body = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: maxTokens || 1000,
        messages: [
          { 
            role: 'user', 
            content: typeof prompt === 'string' 
              ? [{ type: 'text', text: prompt }] 
              : prompt 
          }
        ],
      };
      
      // Add optional parameters if provided
      if (temperature !== undefined) body.temperature = temperature;
      if (topK !== undefined) body.top_k = topK;
      if (topP !== undefined) body.top_p = topP;
      if (stopSequences) body.stop_sequences = stopSequences;
      
    } else if (model.includes('amazon.titan')) {
      // Format for Titan models
      body = {
        inputText: prompt,
        textGenerationConfig: {
          maxTokenCount: maxTokens || 1000,
        }
      };
      
      // Add optional parameters for Titan if provided
      if (temperature !== undefined) body.textGenerationConfig.temperature = temperature;
      if (topP !== undefined) body.textGenerationConfig.topP = topP;
      if (stopSequences) body.textGenerationConfig.stopSequences = stopSequences;
      
    } else {
      return res.status(400).json({ error: 'Unsupported model ID' });
    }

    // Invoke Bedrock model
    const command = new InvokeModelCommand({
      modelId: model,
      body: JSON.stringify(body),
      contentType: 'application/json',
      accept: 'application/json',
    });

    const response = await bedrockClient.send(command);
    
    // Parse the response body
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Format response based on model
    let result: string;
    
    if (model.includes('anthropic.claude')) {
      // Handle Claude 3.x response format
      if (responseBody.content && Array.isArray(responseBody.content)) {
        result = responseBody.content[0].text;
      } else if (responseBody.completion) {
        // Older Claude format
        result = responseBody.completion;
      } else {
        result = JSON.stringify(responseBody);
      }
    } else if (model.includes('amazon.titan')) {
      result = responseBody.results?.[0]?.outputText || responseBody.outputText || 'No text response';
    } else {
      result = 'Response received';
    }

    return res.status(200).json({ result });
  } catch (error: any) {
    console.error('Error invoking Bedrock model:', error);
    return res.status(500).json({ 
      error: 'Failed to invoke Bedrock model',
      details: error.message 
    });
  }
} 