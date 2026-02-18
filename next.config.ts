import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude heavy AI libraries from bundling
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-node", "sharp"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;