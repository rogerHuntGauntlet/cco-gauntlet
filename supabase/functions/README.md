# Supabase Edge Functions

This directory contains Edge Functions for the CCO application. Edge Functions are serverless functions that run on Supabase's edge network, providing low-latency responses globally.

## Available Functions

- **external-data**: Receives and stores data from external services

## Local Development

To develop and test edge functions locally:

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Start a local Supabase instance:
```bash
supabase start
```

3. Serve a function locally:
```bash
supabase functions serve external-data --env-file ./supabase/functions/external-data/.env
```

4. For local testing, create a `.env` file in the function's directory with required secrets (use `.env.example` as template)

## Deployment

To deploy an edge function to production:

```bash
# Deploy a function
supabase functions deploy external-data --no-verify-jwt

# Set environment variables
supabase secrets set EXTERNAL_SERVICE_API_KEY=your_secure_api_key_here
```

## Security

By default, Edge Functions require a valid JWT for authentication. For functions that need to be accessible by external services without authentication, we use:

```bash
supabase functions deploy external-data --no-verify-jwt
```

Instead, we implement our own authentication using API keys in the headers.

## Testing

Each function comes with a test script. For example, to test the external-data function:

```bash
# Local testing
cd supabase/functions/external-data
chmod +x test.sh
./test.sh local

# Production testing
./test.sh production your_actual_api_key
```

## Documentation

See the README in each function's directory for specific details:

- [external-data/README.md](./external-data/README.md)

## Logs

To view function execution logs:

```bash
# Local logs
supabase functions logs --local

# Production logs
supabase functions logs
``` 