-- Supabase migration file to set up triggers - Part 3: Create Triggers
-- Run this in the Supabase SQL Editor after running 1_create_tables.sql and 2_enable_rls.sql

---------------------------------------------------------------------------
-- TRIGGERS FOR TIMESTAMP UPDATES
---------------------------------------------------------------------------

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Triggers for each table
CREATE TRIGGER update_cco_profiles_modtime
BEFORE UPDATE ON cco_profiles
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_cco_projects_modtime
BEFORE UPDATE ON cco_projects
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_cco_meetings_modtime
BEFORE UPDATE ON cco_meetings
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_cco_action_items_modtime
BEFORE UPDATE ON cco_action_items
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_cco_documents_modtime
BEFORE UPDATE ON cco_documents
FOR EACH ROW EXECUTE PROCEDURE update_modified_column(); 