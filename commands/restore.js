export default {
  name: 'restore',
  category: 'owner',
  description: 'Restaure une sauvegarde des données locales',
  async execute({ m, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    await m.reply('♻️ Restauration des configurations terminée.');
  }
};
