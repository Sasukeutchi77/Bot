import { readJson, writeJson } from '../lib/safeStore.js';
import { resolveTargetJid } from '../lib/targetResolver.js';
import path from 'path';

const DB_PATH = path.resolve('./data/warns.json');

export default {
  name: 'unwarn',
  category: 'moderation',
  description: "Retire un avertissement à un membre",
  async execute({ m, args, quoted, isGroup, isSenderAdmin }) {
    if (!isGroup) return m.reply("❌ Commande de groupe.");
    if (!isSenderAdmin) return m.reply("❌ Vous devez être administrateur.");
    const target = resolveTargetJid({ m, args, quoted });
    if (!target) return m.reply("❌ Précisez l'utilisateur.");
    const db = readJson(DB_PATH, {});
    const count = Math.max(0, (db[target] || 1) - 1);
    if (count === 0) delete db[target];
    else db[target] = count;
    writeJson(DB_PATH, db);
    await m.reply(`🛡️ Avertissement retiré. Avertissements restants : *${count}/3*`);
  }
};
