import { readJson, writeJson } from '../lib/safeStore.js';
import path from 'path';

const DB_PATH = path.resolve('./data/afk.json');

export default {
  name: 'afk',
  category: 'utility',
  description: 'Définit votre statut AFK avec une raison optionnelle',
  async execute({ m, args }) {
    const reason = args.join(' ') || 'Occupé(e)';
    const db = readJson(DB_PATH, {});
    db[m.sender] = { reason, time: Date.now() };
    writeJson(DB_PATH, db);
    await m.reply(`💤 *Statut AFK activé*\n📝 *Raison :* ${reason}`);
  }
};
