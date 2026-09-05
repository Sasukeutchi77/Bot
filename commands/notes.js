import { readJson, writeJson } from '../lib/safeStore.js';
import path from 'path';

const DB_PATH = path.resolve('./data/notes.json');

export default {
  name: 'notes',
  category: 'utility',
  description: "Prendre et consulter des notes personnelles",
  async execute({ m, args }) {
    const db = readJson(DB_PATH, {});
    const userNotes = db[m.sender] || [];
    const sub = args[0]?.toLowerCase();
    const content = args.slice(1).join(' ');

    if (sub === 'add' && content) {
      userNotes.push(content);
      db[m.sender] = userNotes;
      writeJson(DB_PATH, db);
      return m.reply("✅ Note enregistrée avec succès.");
    } else if (sub === 'clear') {
      delete db[m.sender];
      writeJson(DB_PATH, db);
      return m.reply("🗑️ Toutes vos notes ont été supprimées.");
    } else {
      if (!userNotes.length) return m.reply("📝 Vous n'avez aucune note. Tapez *.notes add <texte>*");
      const text = userNotes.map((n, i) => `${i + 1}. ${n}`).join('\n');
      return m.reply(`📝 *VOS NOTES :*\n\n${text}`);
    }
  }
};
