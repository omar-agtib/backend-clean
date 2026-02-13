/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    strict: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ["@radix-ui/*", "lucide-react"],
  },
};

export default nextConfig;
