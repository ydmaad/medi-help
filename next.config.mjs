/** @type {import('next').NextConfig} */
const nextConfig = {
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
  webpack: true,
  webpack: (config, options) => {
    config.cache = false;
    return config;
  },
},
};

export default nextConfig;
