import { readJson, writeJson } from '../lib/safeStore.js';
import path from 'path';

const DB_PATH = path.resolve('./data/whitelist.json');

export default {
  name: 'whitelist',
  category: 'security',
  description: "Gère la liste blanche d'utilisateurs autorisés",
  async execute({ m, args, isOwner }) {
    if (!isOwner) return m.reply("❌ Réservé au propriétaire.");
    const db = readJson(DB_PATH, []);
    const num = args[1]?.replace(/[^0-9]/g, '');
    if (args[0] === 'add' && num) {
      if (!db.includes(num)) db.push(num);
      writeJson(DB_PATH, db);
      return m.reply(`✅ +${num} ajouté à la whitelist.`);
    }
    await m.reply(`📋 *Whitelist :* ${db.length ? db.join(', ') : 'Aucun'}`);
  }
};
