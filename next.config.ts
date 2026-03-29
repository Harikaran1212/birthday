import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.24.94.125"],
  experimental: {},
  images: {
    domains: [],
    remotePatterns: [],
  },
};

export default nextConfig;
