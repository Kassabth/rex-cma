/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly opt into Turbopack (Next.js 16+ default)
  // react-globe.gl works fine with no special bundler config needed
  turbopack: {},
};

export default nextConfig;
