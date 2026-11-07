import Link from "next/link";
import { notFound } from "next/navigation";
import { VIDEOS, proxiedEmbed } from "../../../lib/videos";

export function generateStaticParams() {
  return VIDEOS.map((v) => ({ slug: v.slug }));
}

export function generateMetadata({ params }) {
  const v = VIDEOS.find((x) => x.slug === params.slug);
  if (!v) return { title: "Video not found" };
  return { title: `${v.title} — TubeX`, description: `${v.category} video, ${v.views} views. Plays via official embed player.` };
}

export default function VideoPage({ params }) {
  const v = VIDEOS.find((x) => x.slug === params.slug);
  if (!v) notFound();
  const related = VIDEOS.filter((x) => x.slug !== v.slug && x.category === v.category).slice(0, 4);
  return (
    <main className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
      <Link href="/" style={{ color: "#9a9aa8" }}>← Back to Home</Link>
      <h1 style={{ fontSize: "clamp(24px,4vw,38px)", lineHeight: 1.1 }}>{v.title}</h1>
      <p style={{ color: "#9a9aa8" }}>{v.category} • {v.views} views • {v.source}</p>
      <div className="player" style={{ marginTop: 16 }}>
        {v.embed ? (
          <iframe src={proxiedEmbed(v.embed)} allowFullScreen allow="autoplay; fullscreen" title={v.title} />
        ) : (
          <div style={{ padding: 20 }}>
            <p style={{ color: "#bbb" }}>Embed not added yet for this video.</p>
            <p style={{ color: "#888", fontSize: 13 }}>Add the official embed URL in lib/videos.js for slug &quot;{v.slug}&quot;.</p>
          </div>
        )}
      </div>
      <div className="note">
        Growth note: har video ka apna page SEO ke liye zaroori hai — title, category aur tags isi page se search me aayenge.
        Embed videos ka content source ke paas rehta hai, is liye apne page par unique title / description likhna ranking me madad karega.
      </div>
      <h2 style={{ marginTop: 32 }}>Related</h2>
      <div className="grid">
        {related.map((r) => (
          <Link key={r.slug} href={`/video/${r.slug}`} className="card">
            <div className="thumb"><span className="play">▶</span><span className="dur">{r.duration}</span></div>
            <h3>{r.title}<span className="badge">{r.source}</span></h3>
            <p>{r.category} • {r.views} views</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
