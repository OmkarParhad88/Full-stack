import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    cacheLife: {
      page: {
        stale: 3600,     // 1 hour
        revalidate: 60,
        expire: 86400,
      },
    },

  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3000',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
