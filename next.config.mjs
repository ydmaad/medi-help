/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: true,
  webpack: (config, options) => {
    config.cache = false;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
