/**
 * API route for authentication
 * This replaces Supabase Auth
 */

import type { NextApiRequest, NextApiResponse } from 'next';

// Mock user database for demonstration
const mockUsers = [
  { 
    id: 'user_1', 
    email: 'test@example.com', 
    password: 'password123', // In a real app, this would be hashed
    role: 'admin'
  }
];

type ResponseData = {
  success: boolean;
  message?: string;
  error?: string;
  user?: any;
  session?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Extract the action from the request path or body
  const { action } = req.query;
  
  switch (action) {
    case 'signin':
      return handleSignIn(req, res);
    case 'signup':
      return handleSignUp(req, res);
    case 'signout':
      return handleSignOut(req, res);
    case 'session':
      return getSession(req, res);
    default:
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid action specified' 
      });
  }
}

// Sign In handler
async function handleSignIn(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email and password are required' 
    });
  }

  // Find user in mock database
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Create session (24 hour expiry)
    const session = {
      access_token: `mock_token_${Date.now()}`,
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
    
    // In a real implementation, you would set a secure HTTP-only cookie here
    
    return res.status(200).json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      session
    });
  } else {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid email or password' 
    });
  }
}

// Sign Up handler
async function handleSignUp(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email and password are required' 
    });
  }

  // Check if user already exists
  if (mockUsers.some(u => u.email === email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'User already exists with this email address' 
    });
  }

  // Create new user
  const newUser = {
    id: `user_${Date.now()}`,
    email,
    password,
    role: 'user'
  };
  
  // Add to mock database
  mockUsers.push(newUser);
  
  return res.status(201).json({ 
    success: true, 
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    }
  });
}

// Sign Out handler
async function handleSignOut(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // In a real implementation, you would clear the auth cookie here
  
  return res.status(200).json({ 
    success: true, 
    message: 'Signed out successfully' 
  });
}

// Get Session handler
async function getSession(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // In a real implementation, you would validate the session cookie here
  
  return res.status(200).json({ 
    success: true, 
    session: null // No valid session in this demo
  });
} 