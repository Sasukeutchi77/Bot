export default {
  name: 'ocr',
  category: 'tools',
  description: "Extrait le texte d'une image (Reconnaissance Optique de Caractères)",
  async execute({ m, quoted }) {
    if (!quoted) return m.reply("❌ Répondez à une image contenant du texte avec *.ocr*.");
    await m.reply("🔍 Analyse de l'image et extraction du texte...");
  }
};
