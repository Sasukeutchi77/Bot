export default {
  name: 'tagall',
  aliases: ['everyone', 'tous', 'appel'],
  category: 'group',
  adminOnly: true,
  groupOnly: true,
  description: 'Mentionne tous les membres du groupe sans omission et sans crash',

  async execute({ sock, m, args }) {
    try {
      const groupMetadata = await sock.groupMetadata(m.chat);
      const participants = groupMetadata.participants || [];

      if (!participants.length) {
        return m.reply("❌ Impossible de charger la liste des membres du groupe.");
      }

      const announcement = args.length > 0 ? args.join(' ') : "Aucun message précisé";
      const totalCount = participants.length;

      let messageBody = `📢 *APPEL GÉNÉRAL*\n`;
      messageBody += `👥 *Membres totaux :* ${totalCount}\n`;
      messageBody += `📝 *Sujet :* ${announcement}\n\n`;

      const mentions = [];

      // Parcours et construction des mentions pour chaque participant
      for (let i = 0; i < participants.length; i++) {
        const participant = participants[i];
        const jid = participant.id;
        mentions.push(jid);

        // Affichage lisible sans le suffixe serveur
        const cleanNumber = jid.split('@')[0].split(':')[0];
        messageBody += `▫️ ${i + 1}. @${cleanNumber}\n`;
      }

      messageBody += `\n⚡ _Appel généré par @${m.sender.split('@')[0]}_`;
      mentions.push(m.sender);

      await sock.sendMessage(m.chat, {
        text: messageBody,
        mentions: mentions
      }, { quoted: m });

    } catch (error) {
      console.error("[TagAll Error]:", error);
      await m.reply("❌ Une erreur est survenue lors de l'appel du groupe.");
    }
  }
};
