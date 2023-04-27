/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['antd-mobile'],
  async rewrites() {
    return {
      fallback: [
        {
          source: '/qinyingyong/:path*',
          destination: 'http://172.20.62.117:37075/:path*',
        },
        {
          source: '/shijuqinwu-h5/:path*',
          destination: 'http://172.20.62.117:28080/:path*',
        },
      ],
    };
  },
  output: 'standalone',
};

module.exports = nextConfig;
