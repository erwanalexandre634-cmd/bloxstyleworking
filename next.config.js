/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tr.rbxcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'thumbnails.roblox.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 't0.rbxcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 't1.rbxcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 't2.rbxcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 't3.rbxcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 't4.rbxcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 't5.rbxcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 't6.rbxcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 't7.rbxcdn.com',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
