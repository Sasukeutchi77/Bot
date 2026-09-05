import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: 'sticker',
  aliases: ['s', 'autocollant'],
  category: 'media',
  description: 'Convertit une image ou une courte vidéo en sticker WhatsApp',

  async execute({ sock, m, quoted }) {
    const targetMsg = quoted || m;
    const isImage = !!(targetMsg.message?.imageMessage || targetMsg.imageMessage);
    const isVideo = !!(targetMsg.message?.videoMessage || targetMsg.videoMessage);

    if (!isImage && !isVideo) {
      return m.reply("❌ Envoyez ou répondez à une image/vidéo avec la commande *.sticker*.");
    }

    try {
      await m.reply("🎨 Création du sticker en cours...");
      const buffer = await downloadMediaMessage(
        targetMsg,
        'buffer',
        {},
        { logger: console }
      );

      if (!buffer) {
        return m.reply("❌ Impossible de télécharger le média source.");
      }

      await sock.sendMessage(m.chat, {
        sticker: buffer
      }, { quoted: m });
    } catch (err) {
      console.error("[Sticker Error]:", err);
      await m.reply("❌ Erreur lors de la génération du sticker.");
    }
  }
};
