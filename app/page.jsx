"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { VIDEOS, CATEGORIES, SITE_NAME, extractEmbedSrc, isEmbedUrl } from "../lib/videos";

function thumbColor(i) {
  const colors = ["#ff2d55", "#7c5cff", "#00c2a8", "#ff8a00", "#2d9cff"];
  return colors[i % colors.length];
}

export default function Home() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [custom, setCustom] = useState([]);
  const [open, setOpen] = useState(null);

  // Form state for Add Embed
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Trending");
  const [source, setSource] = useState("Pornhub Embed");
  const [embedInput, setEmbedInput] = useState("");
  const [formMsg, setFormMsg] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tubex_custom") || "[]");
      setCustom(saved);
    } catch {}
  }, []);

  const all = useMemo(() => [...custom, ...VIDEOS], [custom]);
  const filtered = all.filter((v) => {
    const okCat = cat === "All" || v.category === cat;
    const hay = `${v.title} ${v.tags || ""} ${v.category}`.toLowerCase();
    return okCat && hay.includes(q.toLowerCase());
  });

  function addEmbed(e) {
    e.preventDefault();
    const embed = extractEmbedSrc(embedInput);
    if (!title.trim()) return setFormMsg("Title likhna zaroori hai.");
    if (!embed) return setFormMsg("Embed URL / iframe code paste karo.");
    if (!isEmbedUrl(embed)) {
      setFormMsg("Warning: ye embed URL nahi lag raha. Watch page URL iframe me nahi chalega — sirf /embed/ wala URL paste karo. Phir bhi save kar diya hai, player check karo.");
    } else {
      setFormMsg("Embed add ho gaya. Neeche grid me dikh raha hai.");
    }
    const item = {
      slug: "custom-" + Date.now(),
      title: title.trim(),
      category,
      duration: "—",
      views: "0",
      source,
      tags: "custom embed",
      embed,
      custom: true,
    };
    const next = [item, ...custom];
    setCustom(next);
    try { localStorage.setItem("tubex_custom", JSON.stringify(next)); } catch {}
    setTitle(""); setEmbedInput("");
  }

  function removeCustom(slug) {
    const next = custom.filter((v) => v.slug !== slug);
    setCustom(next);
    try { localStorage.setItem("tubex_custom", JSON.stringify(next)); } catch {}
  }

  return (
    <main className="container">
      <section className="hero">
        <h1>WATCH.<br />DISCOVER.<br /><em>TRENDING.</em></h1>
        <p>
          Clean, bold and fast tube — built in Next.js. Phase 1 me videos official
          embeds se chalengi. Baad me isi design par apni upload system lagegi,
          player aur cards same rahenge.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
          <a className="btn" href="#add">＋ Add Embed Video</a>
          <Link className="btn-ghost" href="/upload">Own Upload — Phase 2 →</Link>
        </div>
      </section>

      <div className="search" style={{ maxWidth: 640 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search videos, categories, tags..." />
        <button onClick={() => {}}>Search</button>
      </div>

      <div className="pills">
        {CATEGORIES.map((c) => (
          <button key={c} className={cat === c ? "pill active" : "pill"} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      <div className="grid">
        {filtered.map((v, i) => (
          <article key={v.slug} className="card" onClick={() => setOpen(v)}>
            <div className="thumb" style={{ background: `linear-gradient(135deg, ${thumbColor(i)}33, #12121a 60%)` }}>
              <span className="play">▶</span>
              <span className="dur">{v.duration}</span>
            </div>
            <h3>{v.title}<span className="badge">{v.source}</span></h3>
            <p>{v.category} • {v.views} views {v.custom ? "• Your embed" : ""}</p>
            {v.custom && (
              <p><button className="btn-ghost" style={{ padding: "6px 12px" }} onClick={(e) => { e.stopPropagation(); removeCustom(v.slug); }}>Remove</button></p>
            )}
          </article>
        ))}
      </div>
      {filtered.length === 0 && <p style={{ color: "#9a9aa8", paddingBottom: 40 }}>Koi video nahi mili. Search ya category badlo, ya neeche Add Embed se apni video dalo.</p>}

      <section className="panel" id="add">
        <h2>Add Embed Video — Pornhub / xHamster</h2>
        <p>
          Pornhub: video page → Share → Embed → iframe code copy karo, yahan paste karo.
          xHamster: video page → Share / Embed → embed URL copy karo.
          Sirf embed ON wali videos chalengi. Watch URL paste mat karo.
        </p>
        <form onSubmit={addEmbed}>
          <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video title" />
          <div className="row">
            <select className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
            </select>
            <select className="field" value={source} onChange={(e) => setSource(e.target.value)}>
              <option>Pornhub Embed</option><option>xHamster Embed</option>
            </select>
          </div>
          <textarea className="field" rows={3} value={embedInput} onChange={(e) => setEmbedInput(e.target.value)} placeholder="Yahan embed URL ya poora <iframe ...> code paste karo — example: https://www.pornhub.com/embed/xxxx  ya  https://xhamster.com/embed/xxxx" />
          <button className="btn" type="submit">Save Embed Video</button>
          {formMsg && <p style={{ color: "#ffb3c0" }}>{formMsg}</p>}
          <div className="note">
            Ye custom videos isi browser me save hoti hain (localStorage). Live site par inko database me save karna hoga —
            wo Phase 2 ka kaam hai, jab admin panel banega. Built-in videos <code>lib/videos.js</code> me hain, wahan embed URL dalte hi wo sab ko dikhengi.
          </div>
        </form>
      </section>

      {open && (
        <div className="modal" onClick={() => setOpen(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
              <h2 style={{ margin: "4px 0 14px" }}>{open.title}</h2>
              <button className="btn-ghost" onClick={() => setOpen(null)}>Close ✕</button>
            </div>
            <div className="player">
              {open.hostedUrl ? (
                <video src={open.hostedUrl} controls style={{ width: "100%", height: "100%" }} />
              ) : open.embed ? (
                <iframe src={open.embed} allowFullScreen allow="autoplay; fullscreen" title={open.title} />
              ) : (
                <div style={{ padding: 20 }}>
                  <p style={{ color: "#bbb" }}>Is slot ka embed abhi add nahi hua.</p>
                  <p style={{ color: "#888", fontSize: 13 }}>lib/videos.js me is video ke embed field me official embed URL paste karo, ya homepage par Add Embed form use karo.</p>
                </div>
              )}
            </div>
            <p style={{ color: "#9a9aa8" }}>{open.category} • {open.views} views • {open.source}</p>
            {!open.custom && !open.embed && (
              <p><Link className="btn" href={`/video/${open.slug}`}>Open dedicated video page →</Link></p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
