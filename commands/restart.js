export default {
  name: 'restart',
  aliases: ['reboot'],
  category: 'owner',
  description: 'Redémarre le processus du bot WhatsApp',
  async execute({ m, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    await m.reply('🔄 Redémarrage du bot en cours...');
    setTimeout(() => process.exit(0), 1000);
  }
};
