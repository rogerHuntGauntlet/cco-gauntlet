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
    ignoreBuildErrors: false, // Keep general type checking
  },
  // Exclude Supabase functions from build
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        ...(config.watchOptions?.ignored || []),
        '**/supabase/functions/**',
      ],
    };
    
    // Add a rule to ignore Deno files
    config.module.rules.push({
      test: /supabase[/\\]functions/,
      loader: 'ignore-loader',
    });
    
    return config;
  },
};

module.exports = nextConfig; 