# Supabase Database Migration

This directory contains SQL migration files for the CCO application.

## Files

1. `1_create_tables.sql` - Creates all the necessary database tables with their columns and constraints.
2. `2_enable_rls.sql` - Enables Row Level Security (RLS) and creates all policies for each table.
3. `3_create_triggers.sql` - Sets up triggers for automatically updating timestamps.
4. `sample_data.sql` - Provides sample data to test the database structure and application functionality.

## How to Apply Migrations

### Option 1: Using the Supabase SQL Editor (Recommended)

1. Log in to your Supabase dashboard and select your project
2. Navigate to the SQL Editor
3. Create a new query
4. **Important:** Execute the migrations in the correct order:
   
   a. First copy and paste the contents of `1_create_tables.sql`
   b. Run the query and make sure it completes successfully
   c. Create a new query for `2_enable_rls.sql`
   d. Run the query and ensure it completes successfully
   e. Create a new query for `3_create_triggers.sql`
   f. Run the query and ensure it completes successfully
   
5. Once all structure migrations are complete, create another query
6. Open the `sample_data.sql` file and replace the UUIDs at the top with actual user IDs from your auth.users table
   (You can get these by running `SELECT id FROM auth.users;` in the SQL Editor)
7. Copy the updated contents and paste into your new query
8. Run the query to populate the database with sample data

### Option 2: Using Supabase CLI (Advanced)

If you have the Supabase CLI installed, you can use it to apply migrations:

```bash
# Link your project
supabase link --project-ref <your-project-ref>

# Push the migrations
supabase db push
```

## Table Structure

### cco_profiles
- User profiles with personal information
- Linked to auth.users table via user_id

### cco_notifications
- Notifications for users
- Includes various notification types and read status

### cco_projects
- Projects with details and status
- Contains client and vibecoder associations

### cco_meetings
- Meeting information with dates, durations, and summaries
- Linked to projects

### cco_participants
- Junction table linking users to meetings
- Used to track who attended which meetings

### cco_action_items
- Tasks assigned during meetings
- Contains status, priority, and due dates

### cco_documents
- Project and meeting documentation
- Includes various document types and content

## Row Level Security (RLS)

All tables have proper RLS policies to ensure users can only access data they should be allowed to see:

- Profiles: Users can only view/edit their own profile
- Notifications: Users can only see their own notifications
- Projects: Users can see projects they are part of (as client or vibecoder)
- Meetings: Users can see meetings for projects they're involved with
- Participants: Users can see participant lists for meetings they can access
- Action Items: Users can see items assigned to them or from meetings they attended
- Documents: Users can access documents for projects they're involved with

## Troubleshooting

If you encounter errors when running the migrations:

1. Make sure your Supabase project is on a paid plan (free tier has limited functions)
2. Check that the auth.users table has at least one user created
3. Execute the migrations in the correct order: tables → RLS → triggers → sample data
4. If you see `ERROR: 42501: permission denied to set parameter "app.enable_rls"`, this is normal and has been fixed in the current migration files
5. If you see `ERROR: 42703: column "X" does not exist`, make sure you've run the migrations in order and that the first migration completed successfully
6. If a table already exists and you need to recreate it, you can drop it first using `DROP TABLE IF EXISTS table_name CASCADE;`
7. After running migrations, you can verify the setup using the `/api/test-database` API endpoint in the application

## Testing the Database

After applying migrations, use the built-in test page to verify everything is working:

1. Start your application with `npm run dev` or `yarn dev`
2. Navigate to `/api/test-database` in your browser
3. The response should show all tables exist with their row counts
4. If you've added sample data, you should see it in the sample data section

If any table shows as not existing or you see errors, check the console logs for more details 