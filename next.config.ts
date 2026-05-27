import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "malevitamin.co.za",
      },
      {
        protocol: "https",
        hostname: "www.malevitamin.co.za",
      },
    ],
  },
};

export default nextConfig;
