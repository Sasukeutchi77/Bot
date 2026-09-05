import { readJson } from '../lib/safeStore.js';
import path from 'path';

const DB_PATH = path.resolve('./data/warns.json');

export default {
  name: 'warnlist',
  category: 'moderation',
  description: 'Affiche la liste des membres avertis dans le groupe',
  async execute({ m, isGroup }) {
    if (!isGroup) return m.reply('❌ Commande de groupe.');
    const db = readJson(DB_PATH, {});
    const entries = Object.entries(db);
    if (!entries.length) return m.reply('ℹ️ Aucun avertissement actif dans ce groupe.');
    const list = entries.map(([jid, count]) => `• @${jid.split('@')[0]} : ${count}/3`).join('\n');
    await m.reply(`⚠️ *MEMBRES AVERTIS :*\n\n${list}`, { mentions: entries.map(e => e[0]) });
  }
};
