import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The REST API Specification's example payloads serve media from
    // https://cdn.agriverse.app — allow that host plus any subdomain of
    // agriverse.app so staging CDN hosts (e.g. cdn.staging.agriverse.app)
    // work without a config change per environment.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.agriverse.app",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;