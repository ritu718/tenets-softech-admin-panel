/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.synarionit.com'], // <-- allow this hostname
  },
}

module.exports = nextConfig;
