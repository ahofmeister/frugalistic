/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  reactStrictMode: true,
  experimental: {
    staleTimes: { dynamic: 1000, static: 1000 },
  },
};

module.exports = nextConfig;
