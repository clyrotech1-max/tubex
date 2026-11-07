// ============================================================
// TubeX embed proxy (EXPERIMENT — 7 Nov 2026)
// Pornhub embeds are blocked in some regions (e.g. Pakistan), so the
// player document, player JS, poster and HLS video segments are served
// through TubeX's own domain instead of pornhub.com / *.phncdn.com.
//
// How it works:
//  - /px/embed/<key>  -> this middleware fetches the embed page from
//    Pornhub server-side and rewrites every absolute pornhub/phncdn URL
//    in the HTML to a /px/... path (fresh signed video URLs each load,
//    so nothing is cached: cache-control no-store).
//  - /px/ph/*, /px/eeh/*, /px/ep/* ... -> plain rewrites in
//    next.config.mjs that proxy those hosts. The HLS manifest uses
//    RELATIVE segment URLs, so segments stay under /px/eeh/... too.
//
// Honest limits (do not oversell this):
//  - It only helps if Vercel's edge can reach Pornhub (it can today).
//    If Pornhub blocks Vercel IPs, or the player needs something the
//    rewriter misses, playback still fails in blocked regions.
//  - All video bytes flow through Vercel (free tier 100 GB/mo) and
//    proxying third-party adult content may draw AUP attention —
//    watch the project status; this is an experiment, not the
//    long-term fix (that is Phase 2 own-hosting).
//  - Only Pornhub embeds are proxied. xHamster / other embeds pass
//    through unchanged.
// ============================================================
const UPSTREAM = "https://www.pornhub.com";
const HOST_MAP = [
  ["https://www.pornhub.com", "/px/ph"],
  ["https://ee-h.phncdn.com", "/px/eeh"],
  ["https://ep.phncdn.com", "/px/ep"],
  ["https://ei.phncdn.com", "/px/ei"],
  ["https://ev.phncdn.com", "/px/ev"],
  ["https://ci.phncdn.com", "/px/ci"],
  ["https://di.phncdn.com", "/px/di"],
  ["https://kw.phncdn.com", "/px/kw"],
  ["https://pix-cdn77.phncdn.com", "/px/pix77"],
  ["https://pix-fl.phncdn.com", "/px/pixfl"],
];

function rewriteHtml(html) {
  let out = html;
  for (const [from, to] of HOST_MAP) {
    // plain absolute: https://host/...
    out = out.split(from).join(to);
    // JSON-escaped: https:\/\/host\/...
    out = out.split(from.replace(/\//g, "\\/")).join(to.replace(/\//g, "\\/"));
    // protocol-relative: //host/...
    out = out.split(from.replace("https://", "//")).join(to);
  }
  return out;
}

export const config = { matcher: ["/px/embed/:path*"] };

export default async function middleware(req) {
  const url = new URL(req.url);
  const key = url.pathname.replace(/^\/px\/embed\//, "");
  if (!key) return new Response("missing video key", { status: 400 });
  const upstream = `${UPSTREAM}/embed/${key}${url.search}`;
  let res;
  try {
    res = await fetch(upstream, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
      },
    });
  } catch {
    return new Response("embed proxy upstream error", { status: 502 });
  }
  if (!res.ok) return new Response("embed not available", { status: res.status });
  const html = await res.text();
  const headers = new Headers();
  headers.set("content-type", "text/html; charset=utf-8");
  headers.set("cache-control", "no-store");
  const sc = res.headers.get("set-cookie");
  if (sc) headers.set("set-cookie", sc);
  return new Response(rewriteHtml(html), { status: 200, headers });
}
