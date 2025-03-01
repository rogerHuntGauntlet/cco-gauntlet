# External Data Edge Function

This Supabase Edge Function provides an endpoint for external services to send data to your application. The data is stored in the `external_data` table in your Supabase database.

## Features

- Secure authentication using API keys
- Validation of incoming data
- Storage of entire payload with metadata
- CORS support
- Error handling

## Deployment

### Prerequisites

1. Supabase CLI installed: `npm install -g supabase`
2. Login to Supabase: `supabase login`
3. Link to your Supabase project: `supabase link --project-ref <your-project-ref>`

### Deploy the Function

```bash
# From the root of your project
supabase functions deploy external-data --no-verify-jwt
```

The `--no-verify-jwt` flag allows external services to call the function without authentication (we're using our own API key system).

### Set Environment Variables

```bash
# Set your API key for external services
supabase secrets set EXTERNAL_SERVICE_API_KEY=your_secure_api_key_here
```

Note: You don't need to set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as they are automatically provided in the edge function environment.

## Usage

External services can send data to your endpoint using:

```
POST https://<your-project-ref>.supabase.co/functions/v1/external-data
```

With headers:
```
Content-Type: application/json
x-api-key: your_secure_api_key_here
```

And a JSON body that must include a `source` field:
```json
{
  "source": "external_service_name",
  "other_data": "value",
  "nested": {
    "field1": "value1"
  }
}
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Data received and stored successfully",
  "timestamp": "2025-02-28T23:42:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Testing

You can test the edge function locally using the Supabase CLI:

```bash
# Start the local development server
supabase start

# Test locally with curl
curl -X POST http://localhost:54321/functions/v1/external-data \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_secure_api_key_here" \
  -d '{"source": "test", "data": {"key": "value"}}'
```

## Database Table

This function requires the `external_data` table to exist in your Supabase database. Make sure you've run the migration file `4_add_external_data_table.sql` that creates this table. 