/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async rewrites() {
    const backend = process.env.BACKEND_URL || 'http://localhost:5000';
    return [
      { source: '/api/:path*', destination: `${backend}/api/:path*` },
      { source: '/r/:path*', destination: `${backend}/r/:path*` },
    ];
  },
};

module.exports = nextConfig;