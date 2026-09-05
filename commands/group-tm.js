export default {
  name: 'group-tm',
  category: 'group',
  description: 'Affiche la liste des membres silencieux du groupe',
  async execute({ m }) {
    await m.reply('👥 Analyse des membres inactifs du groupe en cours...');
  }
};
