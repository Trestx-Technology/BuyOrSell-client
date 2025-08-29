import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "via.placeholder.com",
      "localhost",
      "images.unsplash.com",
      "plus.unsplash.com",
      "dev-buyorsell.s3.me-central-1.amazonaws.com",
    ],
  },
};

export default nextConfig;
