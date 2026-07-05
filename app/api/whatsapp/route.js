import { NextResponse } from "next/server";
import { getWhatsAppDeviceStatus } from "@/lib/whatsapp-device";

export async function GET() {
  try {
    const status = await getWhatsAppDeviceStatus();
    return NextResponse.json(status);
  } catch {
    return NextResponse.json({ is_connected: false });
  }
}
