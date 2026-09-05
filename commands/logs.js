import { getAuditLogs } from '../lib/auditLogger.js';

export default {
  name: 'logs',
  category: 'owner',
  description: "Affiche les derniers logs d'audit du bot",
  async execute({ m, isOwner }) {
    if (!isOwner) return m.reply("❌ Réservé au propriétaire.");
    const logs = getAuditLogs(10);
    if (!logs.length) return m.reply("ℹ️ Aucun journal disponible.");
    const text = logs.map(l => `[${l.timestamp.slice(11, 19)}] ${l.action} par ${l.actor?.split('@')[0]}`).join('\n');
    await m.reply(`📜 *LOGS D'AUDIT :*\n\n${text}`);
  }
};
