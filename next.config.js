/** @type {import('next').NextConfig} */
const nextConfig = {
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    reactStrictMode: true, experimental: {
        // dynamicIO: true,
    },
};

module.exports = nextConfig;
