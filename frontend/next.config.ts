import type { NextConfig } from "next";

const useReactCompiler = process.env.ENABLE_REACT_COMPILER === "true";

const nextConfig: NextConfig = {
  reactCompiler: useReactCompiler,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
