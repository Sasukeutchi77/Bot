import { readJson, writeJson } from '../lib/safeStore.js';
import path from 'path';

export default {
  name: 'removepremium',
  category: 'owner',
  description: 'Retire un utilisateur de la liste Premium',
  async execute({ m, args, quoted, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    const user = (quoted ? quoted.sender : args[0]?.replace(/[^0-9]/g, '')) || '';
    const file = path.resolve('./data/premium.json');
    const db = readJson(file, []);
    writeJson(file, db.filter(u => u !== user));
    await m.reply('🗑️ Utilisateur retiré des membres Premium.');
  }
};
