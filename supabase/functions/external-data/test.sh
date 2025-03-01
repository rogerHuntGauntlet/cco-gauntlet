#!/bin/bash

# Test script for the external-data edge function
# Usage: ./test.sh [local|production] [api_key]

# Default values
ENVIRONMENT=${1:-local}
API_KEY=${2:-your_secure_api_key_here}

# Set the URL based on environment
if [ "$ENVIRONMENT" == "local" ]; then
  URL="http://localhost:54321/functions/v1/external-data"
  echo "Testing locally at $URL"
elif [ "$ENVIRONMENT" == "production" ]; then
  # Replace with your actual Supabase project reference
  PROJECT_REF="your-project-ref"
  URL="https://$PROJECT_REF.supabase.co/functions/v1/external-data"
  echo "Testing in production at $URL"
else
  echo "Invalid environment. Use 'local' or 'production'"
  exit 1
fi

# Create sample test data
TEST_DATA=$(cat <<EOF
{
  "source": "test_script",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")",
  "test_value": "This is a test message",
  "nested": {
    "field1": "value1",
    "field2": 42,
    "field3": true
  },
  "array_data": [1, 2, 3, 4, 5]
}
EOF
)

# Send the request
echo "Sending test data to $URL with API key $API_KEY"
echo "Request body:"
echo "$TEST_DATA" | jq

# Make the request using curl
curl -s -X POST "$URL" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d "$TEST_DATA" | jq

echo ""
echo "Test completed" 