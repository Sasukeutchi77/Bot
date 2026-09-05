export default {
  name: 'qrcode',
  aliases: ['qr'],
  category: 'utility',
  description: 'Génère un QR Code à partir d’un texte ou d’une URL',

  async execute({ sock, m, args }) {
    const content = args.join(' ').trim();
    if (!content) {
      return m.reply("❌ Précisez le texte ou l'URL à convertir en QR Code.\n_Exemple :_ *.qrcode https://google.com*");
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(content)}`;

    await sock.sendMessage(m.chat, {
      image: { url: qrUrl },
      caption: `📱 *QR Code généré avec succès*\n🔗 *Contenu :* ${content}`
    }, { quoted: m });
  }
};
