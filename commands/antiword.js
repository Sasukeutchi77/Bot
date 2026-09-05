import { readJson, writeJson } from '../lib/safeStore.js';
import path from 'path';

const DB_PATH = path.resolve('./data/antiword.json');

export default {
  name: 'antiword',
  category: 'security',
  description: 'Filtre les mots interdits dans le groupe',
  async execute({ m, args, isGroup, isSenderAdmin }) {
    if (!isGroup) return m.reply('❌ Commande de groupe.');
    if (!isSenderAdmin) return m.reply('❌ Vous devez être administrateur.');
    const db = readJson(DB_PATH, {});
    const words = db[m.chat] || [];
    const subCmd = args[0]?.toLowerCase();
    const word = args.slice(1).join(' ').toLowerCase();

    if (subCmd === 'add' && word) {
      if (!words.includes(word)) words.push(word);
      db[m.chat] = words;
      writeJson(DB_PATH, db);
      return m.reply(`✅ Mot interdit ajouté : *${word}*`);
    } else if (subCmd === 'del' && word) {
      db[m.chat] = words.filter(w => w !== word);
      writeJson(DB_PATH, db);
      return m.reply('🗑️ Mot supprimé de la liste.');
    } else {
      return m.reply(`📜 *Mots interdits :* ${words.length ? words.join(', ') : 'Aucun'}\n_Utilisation :_ *.antiword add <mot>*`);
    }
  }
};
