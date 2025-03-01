-- Supabase migration file to add external_data table
-- This table stores data received from external services

---------------------------------------------------------------------------
-- EXTERNAL DATA TABLE
---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS external_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(255) NOT NULL, -- Name/identifier of the external service
  data JSONB NOT NULL, -- Storing the JSON payload from the external service
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE, -- Flag to indicate if this data has been processed
  processed_at TIMESTAMPTZ, -- When the data was processed
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'processed', 'error')),
  error TEXT, -- Any error message if processing failed
  metadata JSONB -- Additional metadata about the data
);

-- Index for querying by source
CREATE INDEX idx_external_data_source ON external_data(source);

-- Index for finding unprocessed data
CREATE INDEX idx_external_data_processed ON external_data(processed);

-- Index for timestamp-based queries
CREATE INDEX idx_external_data_received_at ON external_data(received_at);

-- Index for status-based queries
CREATE INDEX idx_external_data_status ON external_data(status);

-- Add a comment to the table for documentation
COMMENT ON TABLE external_data IS 'Stores data received from external services through the external-data API endpoint';

-- Grant RLS permissions
ALTER TABLE external_data ENABLE ROW LEVEL SECURITY;

-- Policy for accessing external data - only authenticated users with admin role can access
CREATE POLICY "Allow admins to manage external data"
  ON external_data
  USING (auth.role() = 'authenticated');

-- Function to update processed_at timestamp when processed is set to true
CREATE OR REPLACE FUNCTION update_external_data_processed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.processed = TRUE AND OLD.processed = FALSE THEN
    NEW.processed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update processed_at
CREATE TRIGGER set_external_data_processed_at
  BEFORE UPDATE ON external_data
  FOR EACH ROW
  EXECUTE FUNCTION update_external_data_processed_at(); 