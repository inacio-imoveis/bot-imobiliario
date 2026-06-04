/**
 * sessions.js
 * Gerencia o histórico de conversa por número de WhatsApp.
 * Em produção, substitua o Map por Redis para persistência entre restarts.
 */

const MAX_HISTORY = 20; // máximo de mensagens mantidas por sessão
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas de inatividade = nova sessão

class Session {
  constructor(phone) {
    this.phone = phone;
    this.history = [];
    this.waitingForHuman = false;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    this.meta = {}; // dados coletados: nome, interesse, renda etc.
  }

  addMessage(role, content) {
    this.history.push({ role, content });
    this.updatedAt = Date.now();

    // Mantém janela deslizante: remove as mais antigas preservando contexto
    if (this.history.length > MAX_HISTORY) {
      // Remove o par mais antigo (user + assistant) para manter paridade
      this.history.splice(0, 2);
    }
  }

  getHistory() {
    return this.history;
  }

  isExpired() {
    return Date.now() - this.updatedAt > SESSION_TTL_MS;
  }

  getSummary() {
    return {
      phone: this.phone,
      messages: this.history.length,
      waitingForHuman: this.waitingForHuman,
      updatedAt: new Date(this.updatedAt).toLocaleString("pt-BR"),
      meta: this.meta,
    };
  }
}

class SessionManager {
  constructor() {
    this.sessions = new Map();
    // Limpeza automática de sessões expiradas a cada hora
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }

  get(phone) {
    if (!this.sessions.has(phone) || this.sessions.get(phone).isExpired()) {
      this.sessions.set(phone, new Session(phone));
    }
    return this.sessions.get(phone);
  }

  save(phone, session) {
    this.sessions.set(phone, session);
  }

  count() {
    return this.sessions.size;
  }

  cleanup() {
    let removed = 0;
    for (const [phone, session] of this.sessions.entries()) {
      if (session.isExpired()) {
        this.sessions.delete(phone);
        removed++;
      }
    }
    if (removed > 0) console.log(`[Sessions] Limpeza: ${removed} sessões expiradas removidas.`);
  }

  // Lista todas as sessões ativas (para painel interno)
  listActive() {
    return Array.from(this.sessions.values())
      .filter(s => !s.isExpired())
      .map(s => s.getSummary());
  }
}

export const sessionManager = new SessionManager();
