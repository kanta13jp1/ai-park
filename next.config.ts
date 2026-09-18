import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/ai-park" : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    cpus: 2,
  },
};

export default nextConfig;
