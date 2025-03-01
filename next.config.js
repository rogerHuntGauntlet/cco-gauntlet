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
};

module.exports = nextConfig; 