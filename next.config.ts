import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root so a stray lockfile in the user home folder
  // doesn't confuse Next.js output file tracing.
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
