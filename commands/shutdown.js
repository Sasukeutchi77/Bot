export default {
  name: 'shutdown',
  category: 'owner',
  description: 'Éteint le bot',
  async execute({ m, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    await m.reply('🛑 Arrêt du bot en cours...');
    setTimeout(() => process.exit(0), 1000);
  }
};
