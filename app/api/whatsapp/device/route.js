import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  startWhatsAppDevice,
  getWhatsAppDeviceStatus,
  disconnectWhatsAppDevice,
  sendDeviceWhatsAppMessage,
} from "@/lib/whatsapp-device";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: NextResponse.json({ error: "Admin only" }, { status: 403 }) };
  }

  return { user };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const status = await getWhatsAppDeviceStatus();
  return NextResponse.json(status);
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await request.json();
  const { action, phone, message, admin_phone } = body;

  if (action === "connect") {
    await startWhatsAppDevice();
    const status = await getWhatsAppDeviceStatus();
    return NextResponse.json({ ok: true, ...status });
  }

  if (action === "disconnect") {
    await disconnectWhatsAppDevice();
    return NextResponse.json({ ok: true, is_connected: false });
  }

  if (action === "save_admin_phone") {
    const supabase = await createClient();
    const service = await import("@/lib/supabase/server").then((m) => m.createServiceClient());
    const client = await service;
    const { data: existing } = await client.from("whatsapp_config").select("id").limit(1).single();
    const updates = { admin_phone: admin_phone?.replace(/\D/g, "") || "919064244204", updated_at: new Date().toISOString() };
    if (existing) await client.from("whatsapp_config").update(updates).eq("id", existing.id);
    else await client.from("whatsapp_config").insert(updates);
    return NextResponse.json({ ok: true });
  }

  if (action === "test" && phone) {
    const result = await sendDeviceWhatsAppMessage(
      phone,
      message || "Test message from Om Mosquito Nets — your WhatsApp is linked successfully!"
    );
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
