/**
 * whatsapp.js
 * Funções para envio de mensagens via WhatsApp Cloud API (Meta)
 */

const WA_BASE = `https://graph.facebook.com/v19.0`;

/**
 * Envia mensagem de texto simples
 */
export async function sendWhatsAppMessage(to, text) {
  const res = await fetch(`${WA_BASE}/${process.env.PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text, preview_url: false },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WhatsApp API error: ${err}`);
  }

  return res.json();
}

/**
 * Envia mensagem com botões interativos (ex: "Agendar visita" / "Mais informações")
 */
export async function sendWhatsAppButtons(to, bodyText, buttons) {
  // buttons: [{ id: "visit", title: "Agendar visita" }, ...]
  const res = await fetch(`${WA_BASE}/${process.env.PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: bodyText },
        action: {
          buttons: buttons.map(b => ({
            type: "reply",
            reply: { id: b.id, title: b.title },
          })),
        },
      },
    }),
  });

  if (!res.ok) {
    // fallback para texto simples se botões falharem
    const fallback = bodyText + "\n\n" + buttons.map(b => `• ${b.title}`).join("\n");
    return sendWhatsAppMessage(to, fallback);
  }

  return res.json();
}

/**
 * Marca uma mensagem como lida (melhora UX — aparece os "checks azuis")
 */
export async function markAsRead(messageId) {
  await fetch(`${WA_BASE}/${process.env.PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    }),
  });
}
