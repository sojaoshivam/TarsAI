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
      {
        protocol: "https",
        hostname: "pub-940ccf6255b54fa799a9b01050e6c227.r2.dev",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
};

export default nextConfig;