import { resolveTargetJid } from '../lib/targetResolver.js';

export default {
  name: 'promote',
  aliases: ['admin', 'promouvoir'],
  category: 'moderation',
  description: 'Nomme un membre administrateur du groupe',

  async execute({ sock, m, args, quoted, isGroup, isBotAdmin, isSenderAdmin }) {
    if (!isGroup) return m.reply("❌ Commande réservée aux groupes.");
    if (!isSenderAdmin) return m.reply("❌ Vous devez être administrateur pour promouvoir un membre.");
    if (!isBotAdmin) return m.reply("❌ Le bot doit être administrateur pour nommer des admins.");

    const targetJid = resolveTargetJid({ m, args, quoted });
    if (!targetJid) {
      return m.reply("❌ Précisez le membre à promouvoir (@mention, réponse ou numéro).");
    }

    try {
      await sock.groupParticipantsUpdate(m.chat, [targetJid], 'promote');
      await m.reply(`👑 @${targetJid.split('@')[0]} a été promu administrateur avec succès !`, {
        mentions: [targetJid]
      });
    } catch (err) {
      console.error("[Promote Error]:", err);
      await m.reply("❌ Impossible de promouvoir ce membre.");
    }
  }
};
