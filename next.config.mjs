/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/aituber-list',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
      },
    ],
    unoptimized: true,
  },
  output: 'export',
};

export default nextConfig;
