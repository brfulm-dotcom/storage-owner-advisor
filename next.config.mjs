/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for easy deployment
  // Remove this line if you want server-side rendering later
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
