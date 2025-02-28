# Amazon Bedrock Integration Guide

This guide explains how to set up and use the Amazon Bedrock integration in this application.

## Prerequisites

1. An AWS account with access to Amazon Bedrock
2. AWS credentials configured on your machine or environment
3. Enabled access to the Bedrock models you plan to use (Claude, Titan, etc.)

## Setup Instructions

### 1. Configure AWS Credentials

There are several ways to set up your AWS credentials:

#### Option A: Environment Variables

Set the following environment variables:

```bash
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
```

#### Option B: AWS Credentials File

Make sure your AWS credentials are configured in `~/.aws/credentials`:

```
[default]
aws_access_key_id = your-access-key
aws_secret_access_key = your-secret-key
region = us-east-1
```

#### Option C: Environment File (.env.local)

Create or modify `.env.local` in the project root:

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
DEFAULT_BEDROCK_MODEL=anthropic.claude-3-7-sonnet-20250219-v1:0
```

### 2. Enable Model Access in AWS Bedrock

1. Go to the [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
2. Navigate to "Model access"
3. Select the models you want to use (Claude, Titan, etc.)
4. Click "Request model access"
5. Wait for access approval (usually immediate for most models)

## Using the Bedrock Integration

### In Development

1. Start the development server:

```bash
npm run dev
```

2. Navigate to the AI demo page at http://localhost:3000/ai-demo

### Available Models

The following models are preconfigured for use:

- `CLAUDE_SONNET_3_7`: Claude 3.7 Sonnet - The latest and most capable Claude model
- `CLAUDE_SONNET`: Anthropic Claude 3 Sonnet - Good for most tasks with balanced performance and cost
- `CLAUDE_HAIKU`: Anthropic Claude 3 Haiku - Faster and cheaper than Sonnet
- `TITAN_TEXT`: Amazon Titan Text - Amazon's own LLM model
- `TITAN_MULTIMODAL`: Amazon Titan Multimodal - Handles both text and images

### Using in Your Component

#### Basic Usage

```typescript
import { callBedrockAI, BEDROCK_MODELS } from '../utils/bedrockAI';

// Basic usage
const response = await callBedrockAI({
  prompt: "Your prompt here",
  modelId: BEDROCK_MODELS.CLAUDE_SONNET_3_7,
  maxTokens: 1000
});

// Using the simplified helper
import { askClaude } from '../utils/bedrockAI';

const answer = await askClaude("Your question here");
```

#### Advanced Usage with Claude 3.7

The Claude 3.7 model supports a more detailed request format with additional parameters:

```typescript
import { callBedrockAI, BEDROCK_MODELS } from '../utils/bedrockAI';

// Advanced usage with Claude 3.7
const response = await callBedrockAI({
  modelId: BEDROCK_MODELS.CLAUDE_SONNET_3_7,
  prompt: [{ type: 'text', text: 'Your prompt here' }],
  maxTokens: 200,
  temperature: 1,
  topK: 250,
  topP: 0.999,
  stopSequences: []
});

// Or use the dedicated helper
import { callClaude37 } from '../utils/bedrockAI';

const response = await callClaude37("Your question here", {
  maxTokens: 200,
  temperature: 1
});
```

#### Full Example

Here's a complete example of using Claude 3.7 with all parameters:

```typescript
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
```

## Troubleshooting

### Common Issues

1. **Access Denied Errors**: Ensure your AWS credentials have permission to use Bedrock and that you've enabled the models in the Bedrock console.

2. **Region Issues**: Make sure the AWS region in your configuration matches the region where you've enabled Bedrock models.

3. **Model Not Found**: Verify that you've enabled access to the specific model you're trying to use in the Bedrock console.

### Getting Help

For more information on Amazon Bedrock:
- [Amazon Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-bedrock-runtime/)

## Security Considerations

- Never commit your AWS credentials to version control
- Consider using IAM roles with limited permissions for production deployments
- Monitor your AWS usage to prevent unexpected charges 