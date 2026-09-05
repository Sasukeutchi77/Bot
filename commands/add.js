import { resolveTargetJid } from '../lib/targetResolver.js';

export default {
  name: 'add',
  aliases: ['ajouter'],
  category: 'group',
  description: "Ajoute un membre au groupe",
  async execute({ sock, m, args, isGroup, isBotAdmin, isSenderAdmin }) {
    if (!isGroup) return m.reply("❌ Commande réservée aux groupes.");
    if (!isSenderAdmin) return m.reply("❌ Vous devez être administrateur.");
    if (!isBotAdmin) return m.reply("❌ Le bot doit être administrateur.");
    const target = args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null;
    if (!target) return m.reply("❌ Précisez le numéro à ajouter.");
    try {
      await sock.groupParticipantsUpdate(m.chat, [target], 'add');
      await m.reply("✅ Membre ajouté avec succès.");
    } catch (e) {
      await m.reply("❌ Échec de l'ajout (le membre a peut-être restreint les invitations).");
    }
  }
};
