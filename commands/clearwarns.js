import { readJson, writeJson } from '../lib/safeStore.js';
import { resolveTargetJid } from '../lib/targetResolver.js';
import path from 'path';

const DB_PATH = path.resolve('./data/warns.json');

export default {
  name: 'clearwarns',
  aliases: ['resetwarns'],
  category: 'moderation',
  description: "Réinitialise les avertissements d'un utilisateur",
  async execute({ m, args, quoted, isGroup, isSenderAdmin }) {
    if (!isGroup) return m.reply("❌ Commande de groupe.");
    if (!isSenderAdmin) return m.reply("❌ Vous devez être administrateur.");
    const target = resolveTargetJid({ m, args, quoted });
    if (!target) return m.reply("❌ Précisez l'utilisateur.");
    const db = readJson(DB_PATH, {});
    delete db[target];
    writeJson(DB_PATH, db);
    await m.reply(`✅ Avertissements réinitialisés pour @${target.split('@')[0]}.`, { mentions: [target] });
  }
};
