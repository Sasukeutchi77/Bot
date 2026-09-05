import { readJson, writeJson } from '../lib/safeStore.js';
import { resolveTargetJid } from '../lib/targetResolver.js';
import path from 'path';

const DB_PATH = path.resolve('./data/banned.json');

export default {
  name: 'unban',
  category: 'moderation',
  description: "Débannit un utilisateur du bot",
  async execute({ m, args, quoted, isOwner }) {
    if (!isOwner) return m.reply("❌ Réservé au propriétaire.");
    const target = resolveTargetJid({ m, args, quoted });
    if (!target) return m.reply("❌ Spécifiez l'utilisateur.");
    const db = readJson(DB_PATH, []);
    writeJson(DB_PATH, db.filter(u => u !== target));
    await m.reply(`✅ @${target.split('@')[0]} a été débanni.`, { mentions: [target] });
  }
};
