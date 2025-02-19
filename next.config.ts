import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
  images:{
    domains: ['riponerdokan.com','localhost'],
  }
};

export default nextConfig;
