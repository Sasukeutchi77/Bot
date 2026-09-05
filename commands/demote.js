import { resolveTargetJid } from '../lib/targetResolver.js';

export default {
  name: 'demote',
  aliases: ['retrograder', 'unadmin'],
  category: 'moderation',
  description: 'Rétrograde un administrateur au rang de membre ordinaire',

  async execute({ sock, m, args, quoted, isGroup, isBotAdmin, isSenderAdmin }) {
    if (!isGroup) return m.reply("❌ Commande réservée aux groupes.");
    if (!isSenderAdmin) return m.reply("❌ Vous devez être administrateur.");
    if (!isBotAdmin) return m.reply("❌ Le bot doit être administrateur pour rétrograder.");

    const targetJid = resolveTargetJid({ m, args, quoted });
    if (!targetJid) {
      return m.reply("❌ Précisez l'administrateur à rétrograder (@mention ou réponse).");
    }

    try {
      await sock.groupParticipantsUpdate(m.chat, [targetJid], 'demote');
      await m.reply(`👤 @${targetJid.split('@')[0]} n'est plus administrateur.`, {
        mentions: [targetJid]
      });
    } catch (err) {
      console.error("[Demote Error]:", err);
      await m.reply("❌ Échec de la rétrogradation.");
    }
  }
};
