import "./globals.css";
import AgeGate from "../components/AgeGate";
import { SITE_NAME, SITE_TAGLINE } from "../lib/videos";

export const metadata = {
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: "Embed-based video tube built with Next.js. Clean, fast, mobile-first. Phase 1: official embeds. Phase 2: own uploads.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AgeGate />
        <header className="header">
          <div className="header-in">
            <a className="logo" href="/">{SITE_NAME}<span>.</span></a>
            <a className="navlink" href="/">Home</a>
            <a className="navlink" href="/upload">Upload (Phase 2)</a>
            <a className="navlink" href="/#add">Add Embed</a>
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="container">
            <b style={{ color: "#fff" }}>{SITE_NAME}</b> — Adults only (18+). Videos in Phase 1 play via the source site&apos;s official embed player.
            Only use videos where embed is enabled and content is verified adult content. DMCA / takedown requests and reports must be honoured promptly.
            <br />© {new Date().getFullYear()} {SITE_NAME} — Embed model demo. Own-upload system is planned for Phase 2, see /upload.
          </div>
        </footer>
      </body>
    </html>
  );
}
