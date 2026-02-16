import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Exclude heavy AI libraries from bundling
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-node"],

  // 2. Configure Webpack to ignore specific binaries
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "sharp$": false,
      "onnxruntime-node$": false,
    };
    return config;
  },
};

export default nextConfig;