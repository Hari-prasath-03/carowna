import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*",
      },
    ],
    unoptimized: true,
  },
  allowedDevOrigins: ["10.108.54.150"],
};

export default nextConfig;
