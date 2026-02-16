import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude heavy AI libraries from bundling
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-node", "sharp"],

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;