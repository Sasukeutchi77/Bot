import { readJson, writeJson } from '../lib/safeStore.js';
import path from 'path';

const DB_PATH = path.resolve('./data/blacklist.json');

export default {
  name: 'blacklist',
  category: 'moderation',
  description: 'Gère la liste noire du bot',
  async execute({ m, args, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    const db = readJson(DB_PATH, []);
    const sub = args[0];
    const target = args[1]?.replace(/[^0-9]/g, '');
    if (sub === 'add' && target) {
      if (!db.includes(target)) db.push(target);
      writeJson(DB_PATH, db);
      return m.reply(`⛔ Numéro ${target} ajouté à la blacklist.`);
    } else if (sub === 'del' && target) {
      const updated = db.filter(n => n !== target);
      writeJson(DB_PATH, updated);
      return m.reply('✅ Numéro retiré de la blacklist.');
    }
    await m.reply(`📋 *Blacklist actuelle :* ${db.length ? db.join(', ') : 'Vide'}`);
  }
};
