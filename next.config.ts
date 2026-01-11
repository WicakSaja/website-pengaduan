import type { NextConfig } from "next";
import "dotenv/config";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: (process.env.NEXT_PUBLIC_BACKEND_PROTOCOL || "http") as "http" | "https",
        hostname: (process.env.NEXT_PUBLIC_BACKEND_HOST || "localhost") as string,
        port: (process.env.NEXT_PUBLIC_BACKEND_PORT || "5000") as string,
      },
      {
        protocol: (process.env.NEXT_PUBLIC_BACKEND_PROTOCOL || "http") as "http" | "https",
        hostname: (process.env.NEXT_PUBLIC_BACKEND_HOST || "via.placeholder.com") as string,
      },
    ],
  },
};

export default nextConfig;
