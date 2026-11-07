// ============================================================
// SITE CONFIG - naam yahan se badlo, poori site par badal jayega
// ============================================================
export const SITE_NAME = "TubeX";
export const SITE_TAGLINE = "Watch. Discover. Trending.";

export const CATEGORIES = ["All", "Trending", "New", "Most Viewed", "Featured"];

// ============================================================
// VIDEO DATA - EMBED MODEL (Phase 1)
// Har video ka source "embed" hai. Video tumhare server par nahi,
// Pornhub / xHamster ke official embed player se chalega.
// 
// Embed kaise dalen:
//  1. Pornhub video page -> Share -> Embed -> iframe ka src URL copy karo
//     Example format: https://www.pornhub.com/embed/<id>
//  2. xHamster video page -> Share / Embed -> embed URL copy karo
//     Example format: https://xhamster.com/embed/<id>
//  3. Neeche "embed" field me wo URL paste karo.
//  4. Watch page URL (view_video.php / videos/...) yahan mat dalo,
//     wo iframe me nahi chalega - sirf EMBED url chalega.
//
//  Sirf wo videos use karo jinke uploader ne embed ON rakha ho,
//  aur jo verified adult content hon. Premium / private / disabled
//  embed wali videos blank dikhengi - ye source ki limit hai.
// ============================================================
// Verified 4 Nov 2026 ~22:06 PKT: first 6 embeds checked on their own
// video pages via Share > Embed. No account created, nothing downloaded.
// xHamster NOT added yet: its homepage was blocked by a mandatory
// sign-up dialog (no close button), so no xHamster embeds were collected
// or guessed. Add xHamster later only from a real embed code.
export const VIDEOS = [
  { slug: "trending-01", title: "Trending Clip 01", category: "Trending", duration: "12:34", views: "1.2M", source: "Pornhub Embed", tags: "trending popular", embed: "https://www.pornhub.com/embed/6ae9db5a2d16a" },
  { slug: "trending-02", title: "Trending Clip 02", category: "Trending", duration: "08:20", views: "980K", source: "Pornhub Embed", tags: "trending", embed: "https://www.pornhub.com/embed/6ae95d87dc5a1" },
  { slug: "trending-03", title: "Trending Clip 03", category: "Trending", duration: "15:00", views: "2.1M", source: "Pornhub Embed", tags: "trending popular", embed: "https://www.pornhub.com/embed/6a91c7d1c6e36" },
  { slug: "new-01", title: "New Upload 01", category: "New", duration: "10:10", views: "45K", source: "Pornhub Embed", tags: "new fresh", embed: "https://www.pornhub.com/embed/6841e582b156b" },
  { slug: "new-02", title: "New Upload 02", category: "New", duration: "07:45", views: "32K", source: "Pornhub Embed", tags: "new", embed: "https://www.pornhub.com/embed/66296807caf75" },
  { slug: "new-03", title: "New Upload 03", category: "New", duration: "18:22", views: "61K", source: "Pornhub Embed", tags: "new fresh", embed: "https://www.pornhub.com/embed/ph5ffc7aeb8df62" },
  { slug: "popular-01", title: "Most Viewed 01", category: "Most Viewed", duration: "22:15", views: "5.4M", source: "Pornhub Embed", tags: "popular most viewed", embed: "" },
  { slug: "popular-02", title: "Most Viewed 02", category: "Most Viewed", duration: "11:30", views: "3.8M", source: "xHamster Embed", tags: "popular", embed: "" },
  { slug: "featured-01", title: "Featured Pick 01", category: "Featured", duration: "14:05", views: "890K", source: "Pornhub Embed", tags: "featured editor pick", embed: "" },
  { slug: "featured-02", title: "Featured Pick 02", category: "Featured", duration: "09:55", views: "720K", source: "xHamster Embed", tags: "featured", embed: "" },
  { slug: "trending-04", title: "Trending Clip 04", category: "Trending", duration: "13:40", views: "1.5M", source: "Pornhub Embed", tags: "trending", embed: "" },
  { slug: "blast-video", title: "Blast video", category: "Trending", duration: "15:13", views: "11.2M", source: "Pornhub Embed", tags: "blast trending", embed: "https://www.pornhub.com/embed/67ead888d338a" },
  { slug: "new-04", title: "New Upload 04", category: "New", duration: "06:30", views: "28K", source: "xHamster Embed", tags: "new", embed: "" },
];

// ============================================================
// EMBED HELPERS
// User iframe code bhi paste kar sakta hai - usme se src nikal lo.
// ============================================================
export function extractEmbedSrc(input) {
  if (!input) return "";
  const text = String(input).trim();
  // Full <iframe src="..."> pasted ho to src nikalo
  const m = text.match(/src=["']([^"']+)["']/i);
  if (m) return m[1];
  // Warna poora text hi URL samjho
  return text;
}

export function isEmbedUrl(url) {
  if (!url) return false;
  return url.includes("/embed/") || url.includes("pornhub.com/embed") || url.includes("xhamster.com/embed");
}

// ============================================================
// EMBED PROXY (EXPERIMENT — 7 Nov 2026)
// Pornhub embed URLs are rewritten to TubeX's own /px/embed/... path,
// which middleware.js fetches + rewrites and next.config.mjs proxies.
// Other embeds (xHamster etc.) pass through unchanged.
// ============================================================
export function proxiedEmbed(url) {
  if (!url) return url;
  const m = String(url).match(/^https:\/\/www\.pornhub\.com\/embed\/(.+)$/);
  return m ? `/px/embed/${m[1]}` : url;
}

// ============================================================
// PHASE 2 - APNI UPLOAD (future, abhi sirf structure)
// Jab apni videos upload karni hon to isi Video shape me
// source: "hosted" aur embed ki jagah hostedUrl (mp4 / HLS .m3u8)
// dal do. VideoCard aur VideoPage dono ko koi change nahi chahiye -
// wo pehle hostedUrl check karenge, phir embed.
// ============================================================
// Example future entry:
// { slug: "my-video-01", title: "My Own Video", category: "Featured",
//   duration: "10:00", views: "0", source: "hosted",
//   hostedUrl: "https://cdn.yoursite.com/videos/my-video-01/master.m3u8", embed: "" }
