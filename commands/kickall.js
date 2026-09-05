export default {
  name: 'kickall',
  category: 'owner',
  description: 'Expulse tous les membres non-administrateurs (Propriétaire)',
  async execute({ sock, m, isGroup, isOwner, isBotAdmin }) {
    if (!isGroup) return m.reply('❌ Commande de groupe.');
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    if (!isBotAdmin) return m.reply('❌ Le bot doit être administrateur.');
    const group = await sock.groupMetadata(m.chat);
    const nonAdmins = group.participants.filter(p => !p.admin).map(p => p.id);
    await m.reply(`⚠️ Expulsion de ${nonAdmins.length} membres...`);
    for (const uid of nonAdmins) {
      await sock.groupParticipantsUpdate(m.chat, [uid], 'remove');
    }
    await m.reply('✅ Opération terminée.');
  }
};
