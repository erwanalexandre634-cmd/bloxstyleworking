import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      root: process.cwd(),
    },
  },
  images: {
    domains: [
      'thumbnails.roblox.com',
      'tr.rbxcdn.com',
    ],
  },
};

export default nextConfig;
