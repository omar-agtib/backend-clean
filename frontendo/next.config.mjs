/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  typescript: {
    strict: true,
  },

  images: {
    unoptimized: true,
  },

  experimental: {
    optimizePackageImports: ["@radix-ui/*", "lucide-react"],
  },

  webpack: (config, { isServer }) => {
    // Fix for pdfjs-dist
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    // Prevent pdfjs worker issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};

export default nextConfig;
