import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: 'vv',
  aliases: ['viewonce', 'readviewonce', 'vo'],
  category: 'media',
  description: 'Récupère et renvoie un média à vue unique (photo ou vidéo)',

  async execute({ sock, m, quoted }) {
    if (!quoted) {
      return m.reply("❌ Répondez à un média envoyé en vue unique (photo ou vidéo).");
    }

    // Détection récursive des formats de vue unique Baileys récents
    const rawMsg = quoted.message || {};
    const viewOnceContainer =
      rawMsg.viewOnceMessage?.message ||
      rawMsg.viewOnceMessageV2?.message ||
      rawMsg.viewOnceMessageV2Extension?.message ||
      rawMsg.ephemeralMessage?.message?.viewOnceMessage?.message ||
      rawMsg.ephemeralMessage?.message?.viewOnceMessageV2?.message ||
      rawMsg;

    const isImage = !!viewOnceContainer.imageMessage;
    const isVideo = !!viewOnceContainer.videoMessage;

    if (!isImage && !isVideo) {
      return m.reply("❌ Le message sélectionné n'est pas un média à vue unique supporté.");
    }

    try {
      await m.reply("⏳ Téléchargement du média à vue unique en cours...");

      const mediaType = isImage ? 'image' : 'video';
      const targetMessage = isImage ? viewOnceContainer.imageMessage : viewOnceContainer.videoMessage;

      const buffer = await downloadMediaMessage(
        {
          key: quoted.key,
          message: viewOnceContainer
        },
        'buffer',
        {}
      );

      const caption = targetMessage.caption
        ? `🔓 *Vue Unique Décryptée*\n💬 *Légende :* ${targetMessage.caption}`
        : "🔓 *Média à Vue Unique Récupéré avec Succès*";

      if (isImage) {
        await sock.sendMessage(m.chat, { image: buffer, caption }, { quoted: m });
      } else {
        await sock.sendMessage(m.chat, { video: buffer, caption }, { quoted: m });
      }
    } catch (error) {
      console.error("[VV Command Error]:", error);
      await m.reply("❌ Impossible de récupérer ce média. Le fichier a peut-être expiré des serveurs WhatsApp.");
    }
  }
};
