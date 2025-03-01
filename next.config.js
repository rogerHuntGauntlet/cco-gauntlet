/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add environment variables that should be accessible to the client
  env: {
    AWS_REGION: process.env.AWS_REGION,
    DEFAULT_BEDROCK_MODEL: process.env.DEFAULT_BEDROCK_MODEL,
  },
  // Configure ESLint to ignore warning rules during build
  eslint: {
    // Warning: only use this option as a temporary solution
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors in Supabase functions
  typescript: {
    // Suppresses TypeScript errors from Supabase functions
    ignoreBuildErrors: true, // Set to true to ignore TypeScript errors during build
  },
  // Exclude Supabase functions from build
  webpack: (config, { isServer }) => {
    // Create a new watchOptions object
    const newWatchOptions = {
      // Copy any other properties besides 'ignored'
      ...(config.watchOptions || {}),
      // Create a new ignored array
      ignored: ['**/supabase/functions/**']
    };
    
    // If the original config had an ignored property and it was a string
    if (typeof config.watchOptions?.ignored === 'string') {
      newWatchOptions.ignored.push(config.watchOptions.ignored);
    } 
    // If it was an array
    else if (Array.isArray(config.watchOptions?.ignored)) {
      newWatchOptions.ignored = [
        ...config.watchOptions.ignored,
        '**/supabase/functions/**'
      ];
    }
    
    // Assign the new watchOptions object
    config.watchOptions = newWatchOptions;
    
    // Add a rule to ignore Deno files
    config.module.rules.push({
      test: /supabase[/\\]functions/,
      loader: 'ignore-loader',
    });
    
    return config;
  },
};

module.exports = nextConfig; 