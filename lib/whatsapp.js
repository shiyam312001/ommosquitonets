import { createServiceClient } from "@/lib/supabase/server";
import { formatPrice, BUSINESS } from "@/lib/utils";

export async function getWhatsAppConfig() {
  const supabase = await createServiceClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("whatsapp_config")
    .select("*")
    .limit(1)
    .single();

  return data;
}

export async function logWhatsAppMessage({
  recipientPhone,
  messageType,
  messageBody,
  orderId,
  userId,
  status,
  errorMessage,
}) {
  const supabase = await createServiceClient();
  if (!supabase) return;

  await supabase.from("whatsapp_messages").insert({
    recipient_phone: recipientPhone,
    message_type: messageType,
    message_body: messageBody,
    order_id: orderId || null,
    user_id: userId || null,
    status: status || "pending",
    error_message: errorMessage || null,
  });
}

export function buildWelcomeMessage(fullName) {
  const name = fullName?.trim() || "there";
  return (
    `Welcome to ${BUSINESS.name}, ${name}! 🦟\n\n` +
    `Thank you for creating your account. Browse our custom mosquito nets, magnetic mesh, pleated systems and more.\n\n` +
    `Need help? Call us at ${BUSINESS.phone} or visit our store in Thiruverkadu, Chennai.\n\n` +
    `— Team ${BUSINESS.name}`
  );
}

export function buildOrderCustomerMessage(order, items) {
  const lines = items.map(
    (item) =>
      `• ${item.product_name}${item.variant_details ? ` (${item.variant_details})` : ""} × ${item.quantity} — ${formatPrice(item.price_at_purchase * item.quantity)}`
  );

  return (
    `Hi! Your order at ${BUSINESS.name} is confirmed. ✅\n\n` +
    `Order #${order.id.slice(0, 8).toUpperCase()}\n` +
    `${lines.join("\n")}\n\n` +
    `Total: ${formatPrice(order.total_amount)}\n` +
    `Payment: ${order.payment_method?.toUpperCase() || "COD"}\n` +
    `Delivery to: ${order.shipping_address}\n\n` +
    `We'll contact you shortly to confirm installation details.\n\n` +
    `Questions? ${BUSINESS.phone}`
  );
}

export function buildOrderAdminMessage(order, items, customerName) {
  const lines = items.map(
    (item) =>
      `• ${item.product_name} × ${item.quantity} — ${formatPrice(item.price_at_purchase * item.quantity)}`
  );

  return (
    `🛒 New order on ${BUSINESS.name}\n\n` +
    `Order #${order.id.slice(0, 8).toUpperCase()}\n` +
    `Customer: ${customerName || "Guest"}\n` +
    `Phone: ${order.phone}\n\n` +
    `${lines.join("\n")}\n\n` +
    `Total: ${formatPrice(order.total_amount)}\n` +
    `Address: ${order.shipping_address}\n` +
    `Payment: ${order.payment_method?.toUpperCase() || "COD"}`
  );
}

async function sendCloudApiMessage(phone, message, config) {
  const apiToken = config?.api_token || process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = config?.phone_number_id || process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!apiToken || !phoneNumberId) {
    return { success: false, error: "Cloud API not configured" };
  }

  let digits = String(phone).replace(/\D/g, "");
  if (digits.length === 10) digits = `91${digits}`;

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: digits,
        type: "text",
        text: { body: message },
      }),
    }
  );

  const result = await response.json();
  if (!response.ok) {
    return { success: false, error: result.error?.message || "Send failed", mode: "cloud" };
  }
  return { success: true, mode: "cloud" };
}

/** Send from YOUR linked WhatsApp number (device), fallback to Cloud API */
export async function sendWhatsAppMessage(phone, message) {
  try {
    const { sendDeviceWhatsAppMessage, getWhatsAppDeviceStatus } = await import("@/lib/whatsapp-device");
    const status = await getWhatsAppDeviceStatus();

    if (status.is_connected || status.live) {
      const deviceResult = await sendDeviceWhatsAppMessage(phone, message);
      if (deviceResult.success) return deviceResult;
    }
  } catch {
    /* try cloud fallback */
  }

  const config = await getWhatsAppConfig();
  return sendCloudApiMessage(phone, message, config);
}

export async function notifyWelcome(userId, phone, fullName) {
  if (!phone) return;

  const message = buildWelcomeMessage(fullName);
  const result = await sendWhatsAppMessage(phone, message);

  await logWhatsAppMessage({
    recipientPhone: phone,
    messageType: "welcome",
    messageBody: message,
    userId,
    status: result.success ? "sent" : "failed",
    errorMessage: result.error,
  });

  return result;
}

export async function notifyOrderCreated(order, items, customerName, customerPhone) {
  const config = await getWhatsAppConfig();
  const adminPhone = config?.admin_phone || process.env.WHATSAPP_ADMIN_PHONE || "919064244204";

  const results = [];

  if (customerPhone) {
    const customerMsg = buildOrderCustomerMessage(order, items);
    const customerResult = await sendWhatsAppMessage(customerPhone, customerMsg);
    await logWhatsAppMessage({
      recipientPhone: customerPhone,
      messageType: "order_customer",
      messageBody: customerMsg,
      orderId: order.id,
      userId: order.user_id,
      status: customerResult.success ? "sent" : "failed",
      errorMessage: customerResult.error,
    });
    results.push(customerResult);
  }

  if (adminPhone) {
    const adminMsg = buildOrderAdminMessage(order, items, customerName);
    const adminResult = await sendWhatsAppMessage(adminPhone, adminMsg);
    await logWhatsAppMessage({
      recipientPhone: adminPhone,
      messageType: "order_admin",
      messageBody: adminMsg,
      orderId: order.id,
      status: adminResult.success ? "sent" : "failed",
      errorMessage: adminResult.error,
    });
    results.push(adminResult);
  }

  return results;
}
