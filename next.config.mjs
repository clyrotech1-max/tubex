/** @type {import('next').NextConfig} */
const nextConfig = {
  // Embed players (Pornhub / xHamster iframes) are loaded client-side,
  // so no special image config is needed. Thumbnails are CSS gradients
  // in v1 - later replace with hosted thumbnails from your own CDN.
  reactStrictMode: true,
  // Embed proxy (7 Nov 2026): /px/... paths proxy Pornhub + phncdn hosts
  // so the player, poster and HLS segments come from our own domain.
  // The embed HTML itself is served by app/px/embed/[key]/route.js,
  // which fetches it through EMBED_PROXY_URL when set (see that file).
  async rewrites() {
    return [
      { source: "/px/ph/:path*", destination: "https://www.pornhub.com/:path*" },
      { source: "/px/eeh/:path*", destination: "https://ee-h.phncdn.com/:path*" },
      { source: "/px/ep/:path*", destination: "https://ep.phncdn.com/:path*" },
      { source: "/px/ei/:path*", destination: "https://ei.phncdn.com/:path*" },
      { source: "/px/ev/:path*", destination: "https://ev.phncdn.com/:path*" },
      { source: "/px/ci/:path*", destination: "https://ci.phncdn.com/:path*" },
      { source: "/px/di/:path*", destination: "https://di.phncdn.com/:path*" },
      { source: "/px/kw/:path*", destination: "https://kw.phncdn.com/:path*" },
      { source: "/px/pix77/:path*", destination: "https://pix-cdn77.phncdn.com/:path*" },
      { source: "/px/pixfl/:path*", destination: "https://pix-fl.phncdn.com/:path*" },
    ];
  },
};
export default nextConfig;
