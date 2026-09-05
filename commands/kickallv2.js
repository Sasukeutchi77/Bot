export default {
  name: 'kickallv2',
  category: 'owner',
  description: 'Version optimisée de kickall',
  async execute({ m, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    await m.reply('🛡️ Kickall v2 initialisé.');
  }
};
