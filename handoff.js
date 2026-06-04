/**
 * handoff.js
 * Detecta quando o cliente quer falar com um humano
 * e formata o alerta para o time interno.
 */

// Palavras/frases que disparam transferência para humano
const HANDOFF_PATTERNS = [
  /falar com (um |uma )?(pessoa|atendente|humano|corretor|consultor|gerente|responsável)/i,
  /quero (ser atendido|falar com alguém)/i,
  /não quero (falar com bot|robô|IA|inteligência artificial)/i,
  /me passa (para|pro|pra) (um |uma )?(humano|atendente|corretor|pessoa)/i,
  /atendimento humano/i,
  /falar com alguém/i,
  /preciso de (ajuda|suporte) (urgente|imediato|agora)/i,
  /problema (sério|grave|urgente)/i,
  /reclamação/i,
  /não (consigo|consegui|estou conseguindo)/i,
];

// Palavras de alta intenção de compra (escala prioridade do handoff)
const HIGH_INTENT_PATTERNS = [
  /quero (comprar|fechar|dar entrada|assinar)/i,
  /tenho interesse (sério|real|concreto)/i,
  /proposta/i,
  /financiamento aprovado/i,
  /FGTS/i,
];

/**
 * Detecta se a mensagem deve disparar transferência para humano.
 * Retorna null se não deve, ou string com o motivo se deve.
 */
export function detectHandoffTrigger(text) {
  for (const pattern of HANDOFF_PATTERNS) {
    if (pattern.test(text)) {
      return "Pedido direto do cliente";
    }
  }

  for (const pattern of HIGH_INTENT_PATTERNS) {
    if (pattern.test(text)) {
      return "Alta intenção de compra detectada";
    }
  }

  return null;
}

/**
 * Formata a mensagem de alerta enviada ao corretor/gerente.
 */
export function formatHandoffAlert(phone, session, reason) {
  const lastMessages = session.getHistory()
    .slice(-6) // últimas 3 trocas
    .map(m => `${m.role === "user" ? "👤 Cliente" : "🤖 Bot"}: ${m.content.substring(0, 120)}`)
    .join("\n");

  const meta = session.meta;
  const metaInfo = Object.keys(meta).length
    ? Object.entries(meta).map(([k, v]) => `• ${k}: ${v}`).join("\n")
    : "• Nenhum dado coletado ainda";

  return `🔔 *CLIENTE PRECISA DE ATENDIMENTO*
━━━━━━━━━━━━━━━━━━━━
📱 Número: +${phone}
⚡ Motivo: ${reason}
🕐 Horário: ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}

*Dados coletados:*
${metaInfo}

*Últimas mensagens:*
${lastMessages}
━━━━━━━━━━━━━━━━━━━━
Responda diretamente neste número ou reative o bot em:
POST /handoff/resolve/${phone}`;
}
