import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable ESLint during build for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during build for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
