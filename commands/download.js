export default {
  name: 'download',
  category: 'download',
  description: "Télécharge un contenu multimédia depuis une URL",
  async execute({ sock, m, args }) {
    const url = args[0];
    if (!url) return m.reply("❌ Spécifiez l'URL du fichier.");
    await m.reply("⏳ Téléchargement du fichier...");
    try {
      await sock.sendMessage(m.chat, { document: { url }, mimetype: 'application/octet-stream', fileName: 'fichier' }, { quoted: m });
    } catch (e) {
      await m.reply("❌ Impossible de télécharger le fichier spécifié.");
    }
  }
};
