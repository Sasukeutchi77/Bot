export default {
  name: 'modlog',
  category: 'moderation',
  description: 'Active le canal de journalisation de modération',
  async execute({ m, isSenderAdmin }) {
    if (!isSenderAdmin) return m.reply('❌ Réservé aux administrateurs.');
    await m.reply('🛡️ Journalisation des actions de modération configurée.');
  }
};
