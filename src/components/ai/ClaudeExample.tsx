import { useState } from 'react';
import { callBedrockAI, BEDROCK_MODELS } from '../../utils/bedrockAI';

export default function ClaudeExample() {
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCallClaude = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This uses the exact format from the example
      const result = await callBedrockAI({
        modelId: "anthropic.claude-3-7-sonnet-20250219-v1:0",
        prompt: [
          {
            type: "text",
            text: "hello world"
          }
        ],
        maxTokens: 200,
        topK: 250,
        stopSequences: [],
        temperature: 1,
        topP: 0.999
      });
      
      if (result.error) {
        setError(`Error: ${result.error}. ${result.details || ''}`);
      } else {
        setResponse(result.result || 'No response received');
      }
    } catch (err) {
      setError('Failed to get response from Claude');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Claude 3.7 Example</h2>
      
      <div className="mb-4">
        <p className="text-gray-700 mb-2">
          This example uses the exact format from the provided specification:
        </p>
        <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-60">
{`{
  "modelId": "anthropic.claude-3-7-sonnet-20250219-v1:0",
  "contentType": "application/json",
  "accept": "application/json",
  "body": {
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 200,
    "top_k": 250,
    "stop_sequences": [],
    "temperature": 1,
    "top_p": 0.999,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "hello world"
          }
        ]
      }
    ]
  }
}`}
        </pre>
      </div>
      
      <button
        onClick={handleCallClaude}
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      >
        {isLoading ? 'Calling Claude...' : 'Call Claude 3.7'}
      </button>
      
      {error && (
        <div className="p-3 rounded-lg bg-red-100 text-red-800 mb-4">
          {error}
        </div>
      )}
      
      {response && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Response:</h3>
          <div className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}
    </div>
  );
} 