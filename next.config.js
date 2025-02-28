/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add environment variables that should be accessible to the client
  env: {
    AWS_REGION: process.env.AWS_REGION,
    DEFAULT_BEDROCK_MODEL: process.env.DEFAULT_BEDROCK_MODEL,
  },
};

module.exports = nextConfig; 