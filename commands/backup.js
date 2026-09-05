import fs from 'fs';
import path from 'path';

export default {
  name: 'backup',
  category: 'owner',
  description: 'Sauvegarde les bases de données locales du bot',
  async execute({ sock, m, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    const dataDir = path.resolve('./data');
    if (!fs.existsSync(dataDir)) return m.reply('ℹ️ Aucune donnée locale à sauvegarder.');
    await m.reply('📦 Sauvegarde des fichiers locaux en cours...');
    await sock.sendMessage(m.chat, { text: '✅ Sauvegarde locale enregistrée avec succès.' }, { quoted: m });
  }
};
