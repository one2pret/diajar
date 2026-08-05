import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build minimal untuk Docker (cuma file yang kepakai di-copy ke image runtime)
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
