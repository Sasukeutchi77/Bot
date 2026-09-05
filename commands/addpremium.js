import { readJson, writeJson } from '../lib/safeStore.js';
import path from 'path';

export default {
  name: 'addpremium',
  aliases: ['premadd'],
  category: 'owner',
  description: "Ajoute un utilisateur à la liste Premium",
  async execute({ m, args, quoted, isOwner }) {
    if (!isOwner) return m.reply("❌ Commande réservée au propriétaire.");
    const user = (quoted ? quoted.sender : args[0]?.replace(/[^0-9]/g, '')) || '';
    if (!user) return m.reply("❌ Précisez l'utilisateur.");
    const file = path.resolve('./data/premium.json');
    const db = readJson(file, []);
    if (!db.includes(user)) db.push(user);
    writeJson(file, db);
    await m.reply(`⭐ Utilisateur ${user} ajouté aux membres Premium.`);
  }
};
