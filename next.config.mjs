/** @type {import('next').NextConfig} */
const nextConfig = {
  // REMOVED: output: 'export'
  // With Supabase, we use ISR (Incremental Static Regeneration)
  // Pages are still fast (statically generated) but automatically
  // pick up new vendors from the database every 60 seconds.
  // No more redeploying just to add a vendor!
  images: {
    unoptimized: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
