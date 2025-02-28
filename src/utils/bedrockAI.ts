/**
 * Utility functions for interacting with Amazon Bedrock AI models
 * through our API endpoints
 */

/**
 * Bedrock AI model options
 */
export const BEDROCK_MODELS = {
  CLAUDE_SONNET_3_7: 'anthropic.claude-3-7-sonnet-20250219-v1:0',
  CLAUDE_SONNET: 'anthropic.claude-3-sonnet-20240229-v1:0',
  CLAUDE_HAIKU: 'anthropic.claude-3-haiku-20240307-v1:0',
  TITAN_TEXT: 'amazon.titan-text-express-v1',
  TITAN_MULTIMODAL: 'amazon.titan-multimodal-v1:0'
};

/**
 * Configuration options for Bedrock API requests
 */
export interface BedrockRequestOptions {
  prompt: string | MessageContent[];
  modelId?: string;
  maxTokens?: number;
  temperature?: number;
  topK?: number;
  topP?: number;
  stopSequences?: string[];
}

/**
 * Message content for Claude models
 */
export interface MessageContent {
  type: 'text' | 'image';
  text?: string;
  source?: {
    type: 'base64';
    media_type: string;
    data: string;
  };
}

/**
 * Response from the Bedrock API
 */
export interface BedrockResponse {
  result?: string;
  error?: string;
  details?: string;
}

/**
 * Calls the Bedrock API with the provided prompt and options
 * 
 * @param options - The request options including prompt, modelId, and parameters
 * @returns The response from the Bedrock API
 */
export async function callBedrockAI(options: BedrockRequestOptions): Promise<BedrockResponse> {
  try {
    const response = await fetch('/api/bedrock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: options.prompt,
        modelId: options.modelId,
        maxTokens: options.maxTokens,
        temperature: options.temperature,
        topK: options.topK,
        topP: options.topP,
        stopSequences: options.stopSequences
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || 'Failed to get response from Bedrock',
        details: data.details,
      };
    }

    return {
      result: data.result,
    };
  } catch (error) {
    return {
      error: 'Failed to call Bedrock API',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Simplified function to get a text completion from Claude
 * 
 * @param prompt - The prompt to send to Claude
 * @param maxTokens - Maximum number of tokens in the response (default: 1000)
 * @param temperature - Controls randomness (0-1, default: 0.7)
 * @returns The text response or error
 */
export async function askClaude(
  prompt: string, 
  maxTokens: number = 1000,
  temperature: number = 0.7
): Promise<string> {
  const response = await callBedrockAI({
    prompt,
    modelId: BEDROCK_MODELS.CLAUDE_SONNET_3_7,
    maxTokens,
    temperature
  });

  if (response.error) {
    throw new Error(`Claude error: ${response.error}. ${response.details || ''}`);
  }

  return response.result || '';
}

/**
 * Creates a request using the exact format specified for Claude 3.7
 * 
 * @param prompt - The prompt text to send
 * @param options - Additional options for the request
 * @returns The response from Claude
 */
export async function callClaude37(
  prompt: string,
  options: {
    maxTokens?: number;
    temperature?: number;
    topK?: number;
    topP?: number;
    stopSequences?: string[];
  } = {}
): Promise<BedrockResponse> {
  return callBedrockAI({
    prompt: [{ type: 'text', text: prompt }],
    modelId: BEDROCK_MODELS.CLAUDE_SONNET_3_7,
    maxTokens: options.maxTokens || 200,
    temperature: options.temperature || 1,
    topK: options.topK || 250,
    topP: options.topP || 0.999,
    stopSequences: options.stopSequences || []
  });
} 