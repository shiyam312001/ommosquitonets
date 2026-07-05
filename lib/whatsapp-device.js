import path from "path";
import fs from "fs";
import QRCode from "qrcode";
import pino from "pino";
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import { createServiceClient } from "@/lib/supabase/server";

const AUTH_DIR = path.join(process.cwd(), ".wa-auth");
const logger = pino({ level: "silent" });

function ensureAuthDir() {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }
}

async function updateWhatsAppConfig(updates) {
  const supabase = await createServiceClient();
  if (!supabase) return;

  const { data: existing } = await supabase
    .from("whatsapp_config")
    .select("id")
    .limit(1)
    .single();

  const payload = { ...updates, updated_at: new Date().toISOString() };

  if (existing) {
    await supabase.from("whatsapp_config").update(payload).eq("id", existing.id);
  } else {
    await supabase.from("whatsapp_config").insert({ admin_phone: "919064244204", ...payload });
  }
}

export function formatWhatsAppJid(phone) {
  let digits = String(phone).replace(/\D/g, "");
  if (digits.length === 10) digits = `91${digits}`;
  if (digits.startsWith("0")) digits = digits.slice(1);
  return `${digits}@s.whatsapp.net`;
}

function waitForConnection(sock, timeoutMs = 20000) {
  if (sock.user) return Promise.resolve(sock);

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("WhatsApp not connected. Scan QR in Manage → WhatsApp."));
    }, timeoutMs);

    const handler = (update) => {
      if (update.connection === "open") {
        clearTimeout(timer);
        sock.ev.off("connection.update", handler);
        resolve(sock);
      }
      if (update.connection === "close") {
        clearTimeout(timer);
        sock.ev.off("connection.update", handler);
        reject(new Error("WhatsApp connection closed"));
      }
    };

    sock.ev.on("connection.update", handler);
  });
}

export async function startWhatsAppDevice() {
  if (globalThis.__waStarting) {
    return globalThis.__waSocket;
  }

  if (globalThis.__waSocket?.user) {
    return globalThis.__waSocket;
  }

  globalThis.__waStarting = true;
  ensureAuthDir();

  try {
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      logger,
      printQRInTerminal: false,
      browser: ["Om Mosquito Nets", "Chrome", "1.0.0"],
      syncFullHistory: false,
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        const qrDataUrl = await QRCode.toDataURL(qr);
        await updateWhatsAppConfig({
          qr_code: qrDataUrl,
          is_connected: false,
          connection_mode: "device",
        });
      }

      if (connection === "open") {
        const linked = sock.user?.id?.split(":")[0]?.split("@")[0] || "";
        await updateWhatsAppConfig({
          is_connected: true,
          qr_code: null,
          linked_phone: linked,
          business_phone: linked,
          connection_mode: "device",
          last_connected_at: new Date().toISOString(),
        });
      }

      if (connection === "close") {
        const code = lastDisconnect?.error?.output?.statusCode;
        const loggedOut = code === DisconnectReason.loggedOut;

        globalThis.__waSocket = null;

        await updateWhatsAppConfig({
          is_connected: false,
          qr_code: null,
          ...(loggedOut ? { linked_phone: null, business_phone: null } : {}),
        });

        if (!loggedOut && globalThis.__waAutoReconnect !== false) {
          setTimeout(() => startWhatsAppDevice().catch(console.error), 3000);
        }
      }
    });

    globalThis.__waSocket = sock;
    return sock;
  } finally {
    globalThis.__waStarting = false;
  }
}

export async function getWhatsAppDeviceStatus() {
  const supabase = await createServiceClient();
  const { data } = await supabase
    ?.from("whatsapp_config")
    .select("is_connected, qr_code, linked_phone, business_phone, admin_phone, last_connected_at, connection_mode")
    .limit(1)
    .single() || { data: null };

  const liveConnected = !!globalThis.__waSocket?.user;

  return {
    is_connected: liveConnected || data?.is_connected || false,
    qr_code: data?.qr_code || null,
    linked_phone: data?.linked_phone || data?.business_phone || null,
    admin_phone: data?.admin_phone || "919064244204",
    last_connected_at: data?.last_connected_at || null,
    connection_mode: data?.connection_mode || "device",
    live: liveConnected,
  };
}

export async function sendDeviceWhatsAppMessage(phone, message) {
  if (!phone || !message) {
    return { success: false, error: "Phone and message required" };
  }

  try {
    const sock = await startWhatsAppDevice();
    const ready = await waitForConnection(sock);
    const jid = formatWhatsAppJid(phone);

    await ready.sendMessage(jid, { text: message });
    return { success: true, mode: "device" };
  } catch (err) {
    return { success: false, error: err.message, mode: "device" };
  }
}

export async function disconnectWhatsAppDevice() {
  globalThis.__waAutoReconnect = false;

  if (globalThis.__waSocket) {
    try {
      await globalThis.__waSocket.logout();
    } catch {
      /* ignore */
    }
    globalThis.__waSocket = null;
  }

  if (fs.existsSync(AUTH_DIR)) {
    fs.rmSync(AUTH_DIR, { recursive: true, force: true });
  }

  await updateWhatsAppConfig({
    is_connected: false,
    qr_code: null,
    linked_phone: null,
    business_phone: null,
    session_data: null,
  });

  globalThis.__waAutoReconnect = true;
  return { success: true };
}

export async function processPendingWhatsAppMessages() {
  const supabase = await createServiceClient();
  if (!supabase) return { processed: 0 };

  const { data: pending } = await supabase
    .from("whatsapp_messages")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(10);

  if (!pending?.length) return { processed: 0 };

  let processed = 0;

  for (const msg of pending) {
    const result = await sendDeviceWhatsAppMessage(msg.recipient_phone, msg.message_body);

    await supabase
      .from("whatsapp_messages")
      .update({
        status: result.success ? "sent" : "failed",
        error_message: result.error || null,
      })
      .eq("id", msg.id);

    if (result.success) processed += 1;
  }

  return { processed };
}
