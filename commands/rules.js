import { readJson, writeJson } from '../lib/safeStore.js';
import path from 'path';

const DB_PATH = path.resolve('./data/rules.json');

export default {
  name: 'rules',
  aliases: ['regles'],
  category: 'group',
  description: 'Affiche ou modifie le règlement du groupe',
  async execute({ m, args, isGroup, isSenderAdmin }) {
    if (!isGroup) return m.reply('❌ Commande de groupe.');
    const db = readJson(DB_PATH, {});
    const newRules = args.join(' ');
    if (newRules && isSenderAdmin) {
      db[m.chat] = newRules;
      writeJson(DB_PATH, db);
      return m.reply('✅ Règles du groupe mises à jour.');
    }
    const current = db[m.chat] || 'Aucun règlement spécifique défini.';
    await m.reply(`📜 *RÈGLEMENT DU GROUPE :*\n\n${current}`);
  }
};
