import { resolveTarget } from '../lib/targetResolver.js';

// Stockage en mémoire ou relié à safeStore
const warnDatabase = new Map();

export default {
  name: 'warn',
  aliases: ['avertir', 'warning'],
  category: 'moderation',
  adminOnly: true,
  groupOnly: true,
  description: 'Avertit un membre avec expulsion automatique au 3ème avertissement',

  async execute({ sock, m, args }) {
    try {
      const groupMetadata = await sock.groupMetadata(m.chat);
      const participants = groupMetadata.participants || [];

      const targetJid = resolveTarget(m, args, participants);
      if (!targetJid) {
        return m.reply("❌ Précisez la cible en mentionnant un utilisateur ou en répondant à son message.");
      }

      const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      if (targetJid.split(':')[0] === botId.split('@')[0]) {
        return m.reply("❌ Vous ne pouvez pas avertir le bot.");
      }

      const targetMember = participants.find(p => p.id === targetJid || p.id.split(':')[0] === targetJid.split('@')[0]);
      if (targetMember && targetMember.admin) {
        return m.reply("❌ Les administrateurs ne peuvent pas recevoir d'avertissement.");
      }

      const groupWarnKey = `${m.chat}_${targetJid}`;
      const currentWarns = (warnDatabase.get(groupWarnKey) || 0) + 1;
      warnDatabase.set(groupWarnKey, currentWarns);

      const reason = args.slice(1).join(' ') || "Infraction aux règles du groupe";

      if (currentWarns >= 3) {
        // Expulsion automatique à 3 avertissements
        warnDatabase.delete(groupWarnKey);

        await sock.sendMessage(m.chat, {
          text:
            `🚨 *EXPULSION AUTOMATIQUE*\n\n` +
            `👤 *Membre :* @${targetJid.split('@')[0]}\n` +
            `⚠️ *Raison :* 3/3 avertissements atteints (${reason})\n` +
            `👋 Le membre a été expulsé.`,
          mentions: [targetJid]
        }, { quoted: m });

        await sock.groupParticipantsUpdate(m.chat, [targetJid], 'remove');
      } else {
        await sock.sendMessage(m.chat, {
          text:
            `⚠️ *AVERTISSEMENT AJOUTÉ*\n\n` +
            `👤 *Membre :* @${targetJid.split('@')[0]}\n` +
            `🔢 *Avertissements :* *${currentWarns} / 3*\n` +
            `📝 *Motif :* ${reason}\n\n` +
            `_Attention : au 3ème avertissement, vous serez automatiquement expulsé._`,
          mentions: [targetJid]
        }, { quoted: m });
      }

    } catch (err) {
      console.error("[Warn Error]:", err);
      await m.reply("❌ Une erreur est survenue lors de l'attribution de l'avertissement.");
    }
  }
};
