import React from 'react';
import type { FC } from 'react';
import Link from 'next/link';
import Script from 'next/script';

interface CallToActionProps {
  isDarkMode?: boolean;
}

// Payment Card Component using Stripe Buy Button
const PaymentCard: FC = () => {
  return (
    <div className="bg-nebula-white dark:bg-cosmic-grey bg-opacity-50 dark:bg-opacity-50 rounded-xl p-6 shadow-lg transition-colors duration-300 mb-6">
      <h3 className="text-xl font-medium text-midnight-blue dark:text-cosmic-latte mb-2">Premium Service</h3>
      <div className="text-2xl font-bold text-electric-indigo mb-4">$200</div>
      <ul className="text-cosmic-grey dark:text-stardust mb-6 space-y-2">
        <li className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-electric-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Priority Support
        </li>
        <li className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-electric-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Advanced Features
        </li>
        <li className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-electric-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Unlimited Access
        </li>
      </ul>
      
      {/* Stripe Buy Button */}
      <div className="stripe-button-container">
        <Script async src="https://js.stripe.com/v3/buy-button.js" />
        <stripe-buy-button
          buy-button-id="buy_btn_1QxdPiEWuluK4LYADZD8b2zB"
          publishable-key="pk_live_gWN40hIz2Hds1qotnyqgxWFQ"
          className="w-full"
        />
      </div>
      
      <p className="text-xs text-cosmic-grey dark:text-stardust text-center mt-4">
        Secure payment processing by Stripe
      </p>
    </div>
  );
};

const CallToAction: FC<CallToActionProps> = ({ isDarkMode }) => {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-r from-electric-indigo to-neon-teal transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white bg-opacity-95 dark:bg-obsidian dark:bg-opacity-95 rounded-2xl p-10 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl transition-colors duration-300">
          <div className="md:w-2/3">
            <h2 className="text-3xl md:text-4xl font-semibold text-midnight-blue dark:text-cosmic-latte mb-4">
              Ready to transform your development workflow?
            </h2>
            <p className="text-xl text-cosmic-grey dark:text-stardust max-w-2xl">
              Join the community of vibe coders who have eliminated administrative overhead and enhanced their creative flow.
            </p>
            
            <div className="mt-6 flex flex-wrap gap-4 items-center justify-center md:justify-start">
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-electric-indigo">450+</span>
                <span className="text-sm text-cosmic-grey dark:text-stardust">Active Users</span>
              </div>
              <div className="w-px h-10 bg-cosmic-grey dark:bg-stardust bg-opacity-30 dark:bg-opacity-30 mx-4 hidden md:block"></div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-electric-indigo">2,300+</span>
                <span className="text-sm text-cosmic-grey dark:text-stardust">Meetings Assisted</span>
              </div>
              <div className="w-px h-10 bg-cosmic-grey dark:bg-stardust bg-opacity-30 dark:bg-opacity-30 mx-4 hidden md:block"></div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-electric-indigo">1,150+</span>
                <span className="text-sm text-cosmic-grey dark:text-stardust">PRDs Generated</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/3 w-full max-w-sm space-y-6">
            <PaymentCard />
            
            <div className="bg-nebula-white dark:bg-cosmic-grey bg-opacity-50 dark:bg-opacity-50 rounded-xl p-6 shadow-lg transition-colors duration-300">
              <h3 className="text-xl font-medium text-midnight-blue dark:text-cosmic-latte mb-6">Try It Free</h3>
              
              <form className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full px-4 py-3 bg-white dark:bg-obsidian rounded-md border border-cosmic-grey dark:border-stardust border-opacity-30 dark:border-opacity-30 text-midnight-blue dark:text-nebula-white placeholder-cosmic-grey dark:placeholder-stardust placeholder-opacity-70 dark:placeholder-opacity-70 focus:outline-none focus:border-electric-indigo transition-colors duration-300"
                  />
                </div>
                
                <div>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full px-4 py-3 bg-white dark:bg-obsidian rounded-md border border-cosmic-grey dark:border-stardust border-opacity-30 dark:border-opacity-30 text-midnight-blue dark:text-nebula-white placeholder-cosmic-grey dark:placeholder-stardust placeholder-opacity-70 dark:placeholder-opacity-70 focus:outline-none focus:border-electric-indigo transition-colors duration-300"
                  />
                </div>
                
                <Link
                  href="/landing/register"
                  className="block w-full bg-electric-indigo hover:bg-opacity-90 text-nebula-white text-center px-4 py-3 rounded-md font-medium transition-all"
                >
                  Create Free Account
                </Link>
                
                <p className="text-xs text-cosmic-grey dark:text-stardust text-center">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction; 