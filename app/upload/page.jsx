export const metadata = { title: "Upload — Phase 2 | TubeX" };

export default function UploadPage() {
  return (
    <main className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <h1 style={{ fontSize: "clamp(28px,4vw,44px)" }}>Own Upload — Phase 2</h1>
      <p style={{ color: "#9a9aa8", lineHeight: 1.7, maxWidth: 720 }}>
        Abhi Phase 1 chal raha hai: embeds. Is page ka structure is liye ready rakha hai
        taake jab apni videos upload karni hon to design, cards aur video page dobara
        na banane paren — sirf storage aur transcode jud jayega.
      </p>
      <div className="panel">
        <h2>Phase 2 ka plan (jab tum kaho)</h2>
        <ol style={{ color: "#bbb", lineHeight: 2 }}>
          <li>Upload: video file → adult-friendly storage (S3-compatible / dedicated server)</li>
          <li>Transcode: ffmpeg se 360p / 720p / 1080p + HLS (.m3u8), thumbnails, preview clip</li>
          <li>Database: title, category, tags, performer consent record, status = pending review</li>
          <li>Moderation: admin approve ke baad hi video public hogi — auto-publish nahi</li>
          <li>Player: isi site ka apna player, hostedUrl se chalega (embed ki jagah)</li>
        </ol>
        <p style={{ color: "#888", fontSize: 13 }}>
          API placeholder: <code>/api/upload</code> abhi sirf plan return karta hai, file save nahi karta.
          Is se Phase 1 ka build aur live site safe rehta hai.
        </p>
      </div>
      <div className="panel">
        <h2>Abhi kya kar sakte ho?</h2>
        <p style={{ color: "#bbb", lineHeight: 1.7 }}>
          Homepage par <b style={{ color: "#fff" }}>Add Embed Video</b> form se Pornhub / xHamster embeds add karo.
          Wo foran grid me aa jayenge aur modal player me chalenge. Jab upload system chahiye ho to mujhe
          bas &quot;upload on karo&quot; kehna — storage aur moderation ke saath yehi page live kar dunga.
        </p>
      </div>
    </main>
  );
}
