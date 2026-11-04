# TubeX — Next.js Embed Tube (Phase 1)

## Run
```
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```
Verified: `npm run build` passes (18 pages), `/`, `/video/[slug]`, `/upload` all return 200.

## Kya bana hai?
- **Next.js 14, App Router** — clean, bold, modern dark UI, mobile-first, fast (First Load ~97kB home)
- **Home:** hero, search, category pills, video grid, modal player
- **Video pages:** `/video/<slug>` — har video ka apna SEO page + related videos
- **18+ Age Gate** — localStorage me save hota hai
- **Add Embed (Phase 1):** homepage par form — Pornhub / xHamster ka official embed URL ya poora iframe code paste karo, video foran grid + modal me aa jayega (isi browser me save)
- **Built-in videos:** `lib/videos.js` me — wahan embed URL dalte hi wo sab users ko dikhengi
- **Upload (Phase 2, ready structure):** `/upload` page + `/api/upload` placeholder. Jab on karna ho to storage + ffmpeg HLS + moderation jud jayega, cards/player same rahenge.

## Embed kaise dalen?
Pornhub: Share → Embed → iframe src (https://www.pornhub.com/embed/...)
xHamster: Share / Embed → embed URL (https://xhamster.com/embed/...)
Watch URL mat dalo, sirf /embed/ wala chalega. Sirf embed-ON, verified adult videos use karo.

## Naam badalna?
`lib/videos.js` me `SITE_NAME` badlo.

## Live deploy ke liye yaad rakho
Normal Vercel / shared hosting adult allow nahi karte. Live ke liye adult-friendly VPS / dedicated + adult-friendly CDN chahiye, aur 18+ gate, DMCA, report, consent records zaroori hain.
