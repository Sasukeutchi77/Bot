import { readJson } from '../lib/safeStore.js';
import path from 'path';

const DB_PATH = path.resolve('./data/userEconomy.json');

export default {
  name: 'leaderboard',
  aliases: ['lb', 'top'],
  category: 'games',
  description: 'Classement des membres par expérience et pièces',
  async execute({ m }) {
    const db = readJson(DB_PATH, {});
    const entries = Object.entries(db).sort((a, b) => (b[1].exp || 0) - (a[1].exp || 0)).slice(0, 10);
    if (!entries.length) return m.reply('ℹ️ Aucun classement disponible pour le moment.');
    let text = '🏆 *CLASSEMENT DES JOUEURS*\n\n';
    entries.forEach(([jid, data], idx) => {
      text += `${idx + 1}. @${jid.split('@')[0]} - ⭐ ${data.exp} EXP | 💰 ${data.coins} pièces\n`;
    });
    await m.reply(text, { mentions: entries.map(e => e[0]) });
  }
};
