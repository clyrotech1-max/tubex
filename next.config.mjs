/** @type {import('next').NextConfig} */
const nextConfig = {
  // Embed players (Pornhub / xHamster iframes) are loaded client-side,
  // so no special image config is needed. Thumbnails are CSS gradients
  // in v1 - later replace with hosted thumbnails from your own CDN.
  reactStrictMode: true,
};
export default nextConfig;
