import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Produce a standalone build so the Docker image only needs the minimal files
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "dev-buyorsell.s3.me-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "buyorsell-assets.s3.me-central-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
