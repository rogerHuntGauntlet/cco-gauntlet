import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Initialize Stripe with your secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key', {
  apiVersion: '2025-02-24.acacia', // Use the latest API version
});

type ResponseData = {
  success: boolean;
  message?: string;
  clientSecret?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 20000, // Amount in cents (200 USD)
      currency: 'usd',
      // Verify your integration in this guide by including this parameter
      metadata: {
        integration_check: 'payment_intent_webhook',
      },
    });

    // Send publishable key and PaymentIntent client_secret to client
    const clientSecret = paymentIntent.client_secret || undefined;
    
    res.status(200).json({
      success: true,
      clientSecret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
    
    // Handle other errors
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
    });
  }
} 