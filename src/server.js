import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import { catalog } from "../catalog/imoveis.js";
import { sessionManager } from "./sessions.js";
import { sendWhatsAppMessage } from "./whatsapp.js";
import { buildSystemPrompt } from "./prompt.js";
import { detectHandoffTrigger, formatHandoffAlert } from "./handoff.js";
import { registerDashboardRoutes } from "./dashboard-routes.js";

const app = express();
app.use(express.json());
registerDashboardRoutes(app, sessionManager);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  res.sendStatus(200);
  const entry = req.body?.entry?.[0]?.changes?.[0]?.value;
  const message = entry?.messages?.[0];
  if (!message || message.type !== "text") return;
  const phone = message.from;
  const userText = message.text.body.trim();
  try {
    const session = sessionManager.get(phone);
    if (session.waitingForHuman) return;
    session.addMessage("user", userText);
    const handoffRequest = detectHandoff
