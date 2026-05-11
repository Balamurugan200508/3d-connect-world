import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/way",
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;

