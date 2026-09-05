export default {
  name: 'pack',
  category: 'tools',
  description: "Création de pack de stickers personnalisés",
  async execute({ m }) {
    await m.reply("📦 Pack d'autocollants prêt. Utilisez *.sticker* pour ajouter des éléments.");
  }
};
