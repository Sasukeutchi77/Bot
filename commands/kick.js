import { resolveTarget } from '../lib/targetResolver.js';

export default {
  name: 'kick',
  aliases: ['expulser', 'voter', 'eject'],
  category: 'group',
  adminOnly: true,
  botAdminRequired: true,
  groupOnly: true,
  description: 'Expulse un membre du groupe avec vérification stricte des rôles',

  async execute({ sock, m, args }) {
    try {
      const groupMetadata = await sock.groupMetadata(m.chat);
      const participants = groupMetadata.participants || [];

      // Vérification 1 : Le bot est-il administrateur ?
      const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const botMember = participants.find(p => p.id.split(':')[0] === botId.split('@')[0]);

      if (!botMember || !botMember.admin) {
        return m.reply("❌ Je ne peux pas expulser ce membre car je ne possède pas les droits administrateur dans ce groupe.");
      }

      // Vérification 2 : Résolution de la cible
      const targetJid = resolveTarget(m, args, participants);
      if (!targetJid) {
        return m.reply(
          "❌ Cible introuvable !\n" +
          "👉 Mentionnez la personne (@nom), répondez à l'un de ses messages ou écrivez son numéro."
        );
      }

      // Vérification 3 : Le bot essaie-t-il de s'expulser lui-même ?
      if (targetJid.split(':')[0] === botId.split('@')[0]) {
        return m.reply("❌ Je ne peux pas m'expulser moi-même du groupe.");
      }

      // Vérification 4 : La cible est-elle déjà admin ou propriétaire ?
      const targetMember = participants.find(p => p.id === targetJid || p.id.split(':')[0] === targetJid.split('@')[0]);
      if (!targetMember) {
        return m.reply("❌ Cette personne ne fait plus partie du groupe.");
      }

      if (targetMember.admin) {
        return m.reply("❌ Impossible d'expulser un autre administrateur du groupe.");
      }

      // Exécution de l'expulsion
      await sock.groupParticipantsUpdate(m.chat, [targetMember.id], 'remove');

      await sock.sendMessage(m.chat, {
        text: `👋 L'utilisateur @${targetJid.split('@')[0]} a été expulsé avec succès.`,
        mentions: [targetJid]
      }, { quoted: m });

    } catch (error) {
      console.error("[Kick Error]:", error);
      await m.reply("❌ Une erreur s'est produite lors de la tentative d'expulsion.");
    }
  }
};
