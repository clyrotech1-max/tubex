// ============================================================
// TubeX embed proxy — VPN/proxy-aware fetcher (7 Nov 2026)
// Serves Pornhub's embed player through TubeX's own /px/embed/<key>
// path, rewriting every pornhub.com / *.phncdn.com URL in the HTML to
// a /px/... path (assets + HLS segments are proxied by the rewrites
// in next.config.mjs).
//
// WHY A PROXY IS NEEDED (proven live 7 Nov 2026):
// Vercel's own servers fetch the embed page and Pornhub answers
// "This video is unavailable" — Pornhub refuses its datacenter IPs
// (edge was sfo1, California — not a regional ban). The same URL
// fetched from a normal IP returns the full player. So the embed
// fetch must come from a residential / VPN exit IP, not Vercel's.
//
// HOW IT IS WIRED:
//  - Set EMBED_PROXY_URL in the hosting env (Vercel project settings
//    -> Environment Variables) to an HTTP(S) proxy URL, e.g.
//    http://USER:PASS@HOST:PORT  (residential proxy provider) or
//    http://127.0.0.1:PORT        (a local VPN/proxy forwarder).
//  - When set, the embed fetch goes through that proxy (undici
//    ProxyAgent) — Pornhub sees the proxy's IP/location.
//  - When unset, it fetches directly (works only where Pornhub
//    accepts the server IP — Vercel: does NOT, shows "unavailable").
//  - The signed video URLs are freshly generated on every load
//    (cache-control: no-store) because they expire quickly.
//  - Video segments still travel via Vercel rewrites (/px/eeh/...).
//    If Pornhub ever IP-binds the signatures, segments will 403 and
//    must be routed through the proxy too (see TODO below).
//
// SECURITY: the proxy URL (with credentials) lives ONLY in env vars —
// never commit it, never paste it in chat. Rotate it if it leaks.
// ============================================================
import { ProxyAgent, fetch as undiciFetch } from "undici";

export const dynamic = "force-dynamic";

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
    out = out.split(from).join(to);
    out = out.split(from.replace(/\//g, "\\/")).join(to.replace(/\//g, "\\/"));
    out = out.split(from.replace("https://", "//")).join(to);
  }
  return out;
}

export async function GET(request, { params }) {
  const key = params.key;
  if (!key) return new Response("missing video key", { status: 400 });
  const search = new URL(request.url).search || "";
  const upstream = `${UPSTREAM}/embed/${key}${search}`;

  const proxyUrl = process.env.EMBED_PROXY_URL || "";
  let res;
  try {
    const options = {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
        "accept-language": "en-US,en;q=0.9",
        referer: "https://www.pornhub.com/",
      },
      ...(proxyUrl ? { dispatcher: new ProxyAgent(proxyUrl) } : {}),
    };
    res = await undiciFetch(upstream, options);
  } catch (e) {
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
