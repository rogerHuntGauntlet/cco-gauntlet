-- Sample data for CCO project
-- Run this in the Supabase SQL Editor after running the main migration file

-- IMPORTANT: Replace the following UUIDs with actual user IDs from your auth.users table
-- You can get these by running: SELECT id FROM auth.users;
DO $$
DECLARE
  -- These are placeholders - replace with real UUIDs from your auth.users table
  user1_id UUID := '00000000-0000-0000-0000-000000000001'; -- Replace with an actual user ID
  user2_id UUID := '00000000-0000-0000-0000-000000000002'; -- Replace with another user ID
  
  -- Variables to store IDs for referencing
  profile1_id UUID;
  profile2_id UUID;
  project1_id UUID;
  project2_id UUID;
  meeting1_id UUID;
  meeting2_id UUID;
BEGIN
  -- Create user profiles (if they don't exist)
  INSERT INTO cco_profiles (user_id, name, role, avatar_url)
  VALUES 
    (user1_id, 'Alex Johnson', 'vibecoder', 'https://i.pravatar.cc/150?img=68')
  ON CONFLICT (user_id) DO UPDATE 
  SET name = EXCLUDED.name, role = EXCLUDED.role, avatar_url = EXCLUDED.avatar_url
  RETURNING id INTO profile1_id;
  
  INSERT INTO cco_profiles (user_id, name, role, avatar_url)
  VALUES 
    (user2_id, 'Jordan Smith', 'client', 'https://i.pravatar.cc/150?img=35')
  ON CONFLICT (user_id) DO UPDATE 
  SET name = EXCLUDED.name, role = EXCLUDED.role, avatar_url = EXCLUDED.avatar_url
  RETURNING id INTO profile2_id;

  -- Create projects
  INSERT INTO cco_projects (name, description, client_id, vibecoder_id, status, tags)
  VALUES (
    'E-Commerce Platform', 
    'Modern e-commerce solution with AI-powered recommendations',
    user2_id,
    user1_id,
    'active',
    ARRAY['e-commerce', 'web', 'ai']
  )
  RETURNING id INTO project1_id;
  
  INSERT INTO cco_projects (name, description, client_id, vibecoder_id, status, tags)
  VALUES (
    'CRM Dashboard Redesign',
    'UI/UX overhaul of customer relationship management system',
    user2_id,
    user1_id,
    'completed',
    ARRAY['crm', 'ui/ux', 'dashboard']
  )
  RETURNING id INTO project2_id;

  -- Create meetings
  INSERT INTO cco_meetings (title, date, duration, project_id, status, summary, key_highlights)
  VALUES (
    'E-Commerce Platform Initial Planning',
    NOW() - INTERVAL '2 days',
    60, -- 60 minutes
    project1_id,
    'completed',
    'Discussed requirements for new e-commerce platform. Client needs personalized product recommendations, inventory management, and mobile-responsive design. Timeline is 4 months with MVP in 2 months.',
    ARRAY[
      'Budget approved for full project scope',
      'AI-powered recommendations are top priority',
      'Mobile experience is crucial for target audience',
      'Integration with existing inventory system required',
      'Launch planned for Q3 2023'
    ]
  )
  RETURNING id INTO meeting1_id;
  
  INSERT INTO cco_meetings (title, date, duration, project_id, status)
  VALUES (
    'API Integration Planning',
    NOW() + INTERVAL '2 days',
    45, -- 45 minutes
    project1_id,
    'scheduled'
  )
  RETURNING id INTO meeting2_id;

  -- Create meeting participants
  INSERT INTO cco_participants (meeting_id, user_id)
  VALUES
    (meeting1_id, user1_id),
    (meeting1_id, user2_id),
    (meeting2_id, user1_id),
    (meeting2_id, user2_id);

  -- Create action items
  INSERT INTO cco_action_items (description, assigned_to, meeting_id, due_date, status, priority)
  VALUES (
    'Create detailed project timeline',
    user1_id,
    meeting1_id,
    NOW() + INTERVAL '3 days',
    'open',
    'high'
  );
  
  INSERT INTO cco_action_items (description, assigned_to, meeting_id, due_date, status, priority)
  VALUES (
    'Schedule technical architecture review',
    user1_id,
    meeting1_id,
    NOW() + INTERVAL '5 days',
    'open',
    'medium'
  );
  
  INSERT INTO cco_action_items (description, assigned_to, meeting_id, due_date, status, priority)
  VALUES (
    'Provide access to existing inventory system',
    user2_id,
    meeting1_id,
    NOW() + INTERVAL '2 days',
    'open',
    'high'
  );

  -- Create documents
  INSERT INTO cco_documents (title, type, content, project_id, tags, status)
  VALUES (
    'Project Requirements Document',
    'prd',
    '# E-Commerce Platform Requirements

## Overview
The client requires a modern e-commerce platform with advanced AI-powered recommendations and seamless payment processing.

## Key Features
1. Personalized product recommendations
2. Integrated payment processing
3. Inventory management
4. Customer account management
5. Admin dashboard for analytics
6. Mobile-responsive design

## Technical Requirements
- React frontend with Next.js
- Node.js backend
- PostgreSQL database
- Redis for caching
- AWS infrastructure
- CI/CD pipeline

## Timeline
- MVP: 2 months
- Full launch: 4 months',
    project1_id,
    ARRAY['e-commerce', 'requirements', 'ai'],
    'draft'
  );
  
  INSERT INTO cco_documents (title, type, content, project_id, tags, status)
  VALUES (
    'Technical Architecture Proposal',
    'other',
    '# E-Commerce Platform Architecture

## Frontend
- Next.js for server-side rendering
- TailwindCSS for styling
- Redux for state management
- Jest for testing

## Backend
- Express.js API layer
- GraphQL for complex queries
- JWT authentication
- Microservices for payments and recommendations

## Database
- PostgreSQL for relational data
- Redis for session storage and caching
- Elasticsearch for product search

## Infrastructure
- Docker containers
- Kubernetes orchestration
- AWS hosting
- CloudFront CDN

## CI/CD
- GitHub Actions
- Automated testing
- Staging and production environments',
    project1_id,
    ARRAY['architecture', 'technical', 'infrastructure'],
    'draft'
  );

  -- Create notifications
  INSERT INTO cco_notifications (user_id, title, message, type, is_read, link, related_item_id, related_item_type)
  VALUES (
    user1_id,
    'New action item assigned',
    'You have been assigned a new action item: Create detailed project timeline',
    'action',
    FALSE,
    '/dashboard/action-items',
    NULL,
    'action'
  );
  
  INSERT INTO cco_notifications (user_id, title, message, type, is_read, link, related_item_id, related_item_type)
  VALUES (
    user1_id,
    'Upcoming meeting reminder',
    'Reminder: API Integration Planning meeting tomorrow',
    'meeting',
    FALSE,
    '/dashboard/meetings',
    meeting2_id,
    'meeting'
  );
  
  INSERT INTO cco_notifications (user_id, title, message, type, is_read, link, related_item_id, related_item_type)
  VALUES (
    user2_id,
    'Document ready for review',
    'The Project Requirements Document is ready for your review',
    'document',
    FALSE,
    '/dashboard/documents',
    NULL,
    'document'
  );

END $$; 