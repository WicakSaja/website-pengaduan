import type { NextConfig } from "next";

const backendProtocol =
  (process.env.NEXT_PUBLIC_BACKEND_PROTOCOL as "http" | "https") ?? "http";

const backendHost =
  process.env.NEXT_PUBLIC_BACKEND_HOST ?? "localhost";

const backendPort =
  process.env.NEXT_PUBLIC_BACKEND_PORT ?? "5000";

const isLocalhost = backendHost === "localhost";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: backendProtocol,
        hostname: backendHost,
        ...(isLocalhost ? { port: backendPort } : {}),
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

export default nextConfig;
