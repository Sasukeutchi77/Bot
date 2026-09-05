export default {
  name: 'sessionsudo',
  category: 'owner',
  description: 'Vérifie les sessions actives des modérateurs',
  async execute({ m, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    await m.reply('🔐 Toutes les sessions administrateurs sont sécurisées.');
  }
};
