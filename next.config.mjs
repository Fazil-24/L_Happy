/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: {
    // officeparser uses dynamic requires + ESM deps; keep it in Node runtime
    serverComponentsExternalPackages: ["officeparser"],
  },
};

export default nextConfig;
