import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4003/api/:path*",
      },
    ]
  },
}

export default nextConfig

