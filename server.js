import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import { catalog } from "./imoveis.js";
import { sessionManager } from "./sessions.js";
import { sendWhatsAppMessage, sendWhatsAppTemplate } from "./whatsapp.js";
import { buildSystemPrompt } from "./prompt.js";
import { detectHandoffTrigger, formatHandoffAlert } from "./handoff.js";

const app = express();
app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Verificação do Webhook (Meta) ────────────────────────────────────────────
app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(403);
  }
});

// ─── Recebimento de Mensagens ─────────────────────────────────────────────────
app.post("/webhook", async (req, res) => {
  res.sendStatus(200); // responde imediatamente para evitar timeout da Meta

  const entry = req.body?.entry?.[0]?.changes?.[0]?.value;
  const message = entry?.messages?.[0];
  if (!message || message.type !== "text") return;

  const phone = message.from;
  const userText = message.text.body.trim();

  console.log(`[${phone}] → ${userText}`);

  try {
    // 1. Carrega/cria sessão do cliente
    const session = sessionManager.get(phone);

    // 2. Se está em modo "aguardando humano", ignora bot
    if (session.waitingForHuman) {
      console.log(`[${phone}] Em espera de atendente — bot pausado.`);
      return;
    }

    // 3. Adiciona mensagem do usuário ao histórico
    session.addMessage("user", userText);

    // 4. Detecta se é pedido urgente de falar com humano
    const handoffRequest = detectHandoffTrigger(userText);
    if (handoffRequest) {
      session.waitingForHuman = true;
      sessionManager.save(phone, session);

      await sendWhatsAppMessage(
        phone,
        "Entendido! 🙋 Vou chamar um de nossos consultores agora. Em instantes alguém entrará em contato com você. Aguarde um momento."
      );

      // Notifica o time interno (número do corretor/gerente)
      await notifyTeam(phone, session, handoffRequest);
      return;
    }

    // 5. Chama Claude com histórico completo
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: buildSystemPrompt(catalog),
      messages: session.getHistory(),
    });

    const reply = response.content[0].text;

    // 6. Salva resposta no histórico
    session.addMessage("assistant", reply);
    sessionManager.save(phone, session);

    // 7. Envia resposta ao cliente
    await sendWhatsAppMessage(phone, reply);

    // 8. Detecta intenção de visita/proposta e envia template CTA
    if (/agendar|visita|proposta|interesse|quero ver/i.test(userText)) {
      await sendLeadCTA(phone, session);
    }

  } catch (err) {
    console.error(`[${phone}] Erro:`, err.message);
    await sendWhatsAppMessage(
      phone,
      "Desculpe, tive um problema técnico momentâneo. Pode repetir sua mensagem? 🙏"
    );
  }
});

// ─── Notificação interna de handoff ───────────────────────────────────────────
async function notifyTeam(phone, session, reason) {
  const TEAM_NUMBER = process.env.TEAM_PHONE_NUMBER;
  if (!TEAM_NUMBER) return;

  const alert = formatHandoffAlert(phone, session, reason);
  await sendWhatsAppMessage(TEAM_NUMBER, alert);
}

// ─── CTA de agendamento ────────────────────────────────────────────────────────
async function sendLeadCTA(phone, session) {
  await new Promise(r => setTimeout(r, 2000));
  await sendWhatsAppMessage(
    phone,
    "📅 Posso agendar uma visita sem compromisso para você conhecer pessoalmente! Quer que eu passe para um consultor confirmar o melhor horário?"
  );
}

// ─── Endpoint para o corretor retomar atendimento ─────────────────────────────
app.post("/handoff/resolve/:phone", (req, res) => {
  const phone = req.params.phone;
  const session = sessionManager.get(phone);
  session.waitingForHuman = false;
  sessionManager.save(phone, session);
  res.json({ ok: true, message: `Bot reativado para ${phone}` });
});

// ─── Status / health check ────────────────────────────────────────────────────
app.get("/status", (req, res) => {
  res.json({
    status: "online",
    sessions: sessionManager.count(),
    uptime: process.uptime(),
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🤖 Bot imobiliário rodando na porta", process.env.PORT || 3000);
});
