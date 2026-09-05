export default {
  name: 'maintenance',
  category: 'owner',
  description: 'Active ou désactive le mode maintenance du bot',
  async execute({ m, args, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    const state = args[0]?.toLowerCase() === 'on';
    await m.reply(`🛠️ Mode maintenance : *${state ? 'ACTIVÉ' : 'DÉSACTIVÉ'}*`);
  }
};
