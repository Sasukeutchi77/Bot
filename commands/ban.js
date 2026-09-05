import { resolveTargetJid } from '../lib/targetResolver.js';
import { readJson, writeJson } from '../lib/safeStore.js';
import path from 'path';

const DB_PATH = path.resolve('./data/banned.json');

export default {
  name: 'ban',
  category: 'moderation',
  description: "Bannit un utilisateur des commandes du bot",
  async execute({ m, args, quoted, isOwner }) {
    if (!isOwner) return m.reply("❌ Réservé au propriétaire.");
    const target = resolveTargetJid({ m, args, quoted });
    if (!target) return m.reply("❌ Spécifiez l'utilisateur à bannir.");
    const db = readJson(DB_PATH, []);
    if (!db.includes(target)) db.push(target);
    writeJson(DB_PATH, db);
    await m.reply(`🚫 @${target.split('@')[0]} est désormais banni du bot.`, { mentions: [target] });
  }
};
