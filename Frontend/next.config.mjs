/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Production optimizations
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
}

export default nextConfig
