/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [];
  },
  webpack: (config) => {
    return config;
  }
}

module.exports = nextConfig 