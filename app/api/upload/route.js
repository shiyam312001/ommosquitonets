import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const BUCKET = "product-images";
// Allow larger uploads (videos) — set to 25MB
const MAX_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  // video types
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/ogg",
];

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    let formData;
    try {
      formData = await request.formData();
    } catch (err) {
      return NextResponse.json({ error: "Failed to parse body as FormData. Is the request multipart/form-data and within size limits?" }, { status: 400 });
    }
    const file = formData.get("file");
    const folderRaw = formData.get("folder");
    const folder =
      typeof folderRaw === "string" && /^[a-z0-9-]+$/.test(folderRaw)
        ? folderRaw
        : "products";

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const extToMime = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
      mp4: "video/mp4",
      webm: "video/webm",
      mov: "video/quicktime",
      ogg: "video/ogg",
      ogv: "video/ogg",
    };
    const contentType =
      file.type && ALLOWED_TYPES.includes(file.type)
        ? file.type
        : extToMime[ext] || file.type;

    if (!contentType || !ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: "Invalid file type. Use JPG, PNG, WebP, GIF, MP4, or WebM." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max 25MB." }, { status: 400 });
    }

    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || "jpg"}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const serviceClient = await createServiceClient();

    if (!serviceClient) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const { error: uploadError } = await serviceClient.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      let message = uploadError.message;
      if (uploadError.message.includes("Bucket not found")) {
        message =
          "Storage bucket missing. Run supabase/migrations/005_storage_bucket.sql in Supabase SQL Editor.";
      } else if (/mime type .* is not supported/i.test(uploadError.message)) {
        message =
          "Storage bucket does not allow this file type yet. Run supabase/migrations/011_storage_video_support.sql in Supabase SQL Editor.";
      }
      return NextResponse.json({ error: message }, { status: 500 });
    }

    const { data: { publicUrl } } = serviceClient.storage
      .from(BUCKET)
      .getPublicUrl(path);

    return NextResponse.json({ url: publicUrl, path });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
