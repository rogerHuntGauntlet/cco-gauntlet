import { NextPage } from 'next';
import Head from 'next/head';
import AIChat from '../components/ai/AIChat';
import ClaudeExample from '../components/ai/ClaudeExample';

const AIDemo: NextPage = () => {
  return (
    <>
      <Head>
        <title>AI Demo - Amazon Bedrock Integration</title>
        <meta name="description" content="Demo of Amazon Bedrock AI integration" />
      </Head>

      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Amazon Bedrock AI Demo</h1>
            <p className="text-gray-600">
              This demo showcases integration with Amazon Bedrock AI services.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <p className="mb-2">
              This demo uses Amazon Bedrock to generate AI responses. To use this demo:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Make sure your AWS credentials are properly set up</li>
              <li>Type a message in the chat box below</li>
              <li>The response will be generated using Amazon Bedrock</li>
            </ol>
            <div className="mt-4 p-4 bg-yellow-50 rounded-md border border-yellow-200">
              <p className="text-yellow-800 text-sm font-medium">
                Note: This requires valid AWS credentials with access to Amazon Bedrock.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Claude 3.7 Example</h2>
            <ClaudeExample />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Chat</h2>
            <AIChat />
          </div>
        </div>
      </div>
    </>
  );
};

export default AIDemo; 