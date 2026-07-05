import { NextResponse } from "next/server";
import { notifyWelcome } from "@/lib/whatsapp";

export async function POST(request) {
  try {
    const { userId, phone, fullName } = await request.json();

    if (!userId || !phone) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const result = await notifyWelcome(userId, phone, fullName);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
