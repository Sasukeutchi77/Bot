export default {
  name: 'approve',
  category: 'moderation',
  description: "Approuve les demandes d'adhésion en attente dans le groupe",
  async execute({ sock, m, isGroup, isBotAdmin, isSenderAdmin }) {
    if (!isGroup) return m.reply("❌ Commande de groupe.");
    if (!isSenderAdmin) return m.reply("❌ Vous devez être administrateur.");
    if (!isBotAdmin) return m.reply("❌ Le bot doit être administrateur.");
    try {
      const pending = await sock.groupRequestParticipantsList(m.chat);
      if (!pending || !pending.length) return m.reply("ℹ️ Aucune demande en attente.");
      for (const p of pending) {
        await sock.groupRequestParticipantsUpdate(m.chat, [p.jid], 'approve');
      }
      await m.reply(`✅ ${pending.length} membre(s) approuvé(s).`);
    } catch (e) {
      await m.reply("❌ Erreur lors de l'approbation des demandes.");
    }
  }
};
