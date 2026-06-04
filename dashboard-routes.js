import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function registerDashboardRoutes(app, sessionManager) {

  app.get('/dashboard', (req, res) => {
    if (!checkAuth(req, res)) return;
    const html = readFileSync(path.join(__dirname, '../dashboard/index.html'), 'utf-8');
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });

  app.get('/dashboard/sessions', (req, res) => {
    if (!checkAuth(req, res)) return;
    const list = sessionManager.listActive().map(s => ({
      phone: s.phone,
      messages: s.messages,
      waitingForHuman: s.waitingForHuman,
      updatedAt: s.updatedAt,
      lastMessage: s.lastMessage || '—',
      meta: s.meta,
    }));
    res.json({ sessions: list, uptime: process.uptime() });
  });

  app.get('/dashboard/session/:phone', (req, res) => {
    if (!checkAuth(req, res)) return;
    const session = sessionManager.get(req.params.phone);
    const history = session.getHistory().map(m => ({
      role: m.role, content: m.content, time: '',
    }));
    res.json({ phone: req.params.phone, history, waitingForHuman: session.waitingForHuman, meta: session.meta });
  });

  app.post('/handoff/pause/:phone', (req, res) => {
    if (!checkAuth(req, res)) return;
    const session = sessionManager.get(req.params.phone);
    session.waitingForHuman = true;
    sessionManager.save(req.params.phone, session);
    res.json({ ok: true });
  });
}

function checkAuth(req, res) {
  const token = process.env.DASHBOARD_TOKEN;
  if (!token) return true;
  const auth = req.headers['authorization'] || req.query.token;
  if (auth === token || auth === `Bearer ${token}`) return true;
  res.status(401).json({ error: 'Não autorizado.' });
  return false;
}
