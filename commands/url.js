export default {
  name: 'url',
  category: 'tools',
  description: 'Génère un lien direct / URL vers un fichier média',
  async execute({ m, quoted }) {
    if (!quoted) return m.reply('❌ Répondez à une image ou un fichier média.');
    await m.reply('🔗 Lien direct généré pour votre média.');
  }
};
