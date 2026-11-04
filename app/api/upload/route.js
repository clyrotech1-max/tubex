export async function POST() {
  // Phase 2 placeholder - deliberately does NOT accept files yet.
  // When upload is switched on, this route will:
  // 1) validate file + performer consent, 2) store to S3-compatible storage,
  // 3) queue ffmpeg HLS transcode, 4) create a pending-review DB record.
  return Response.json({
    status: "planned",
    phase: 1,
    message: "Own upload is Phase 2. Phase 1 uses official embeds only.",
    next_steps: ["storage", "ffmpeg-hls-transcode", "thumbnail-generation", "admin-moderation"],
  }, { status: 501 });
}
