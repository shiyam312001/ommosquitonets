import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const BUCKET = "product-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

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

    const formData = await request.formData();
    const file = formData.get("file");
    const folderRaw = formData.get("folder");
    const folder =
      typeof folderRaw === "string" && /^[a-z0-9-]+$/.test(folderRaw)
        ? folderRaw
        : "products";

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Use JPG, PNG, or WebP." }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max 5MB." }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const serviceClient = await createServiceClient();

    if (!serviceClient) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const { error: uploadError } = await serviceClient.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      const message = uploadError.message.includes("Bucket not found")
        ? "Storage bucket missing. Run supabase/migrations/005_storage_bucket.sql in Supabase SQL Editor."
        : uploadError.message;
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
