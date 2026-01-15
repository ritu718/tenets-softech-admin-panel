/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.tenetssoftech.com'], // <-- allow this hostname
  },

}

module.exports = nextConfig;
