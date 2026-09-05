export default {
  name: 'quote',
  aliases: ['citation'],
  category: 'fun',
  description: "Affiche une citation inspirante aléatoire",
  async execute({ m }) {
    const quotes = [
      '« Le plus grand risque est de ne prendre aucun risque. » - Mark Zuckerberg',
      '« La simplicité est la sophistication suprême. » - Léonard de Vinci',
      "« Rien n'est permanent, sauf le changement. » - Héraclite"
    ];
    const pick = quotes[Math.floor(Math.random() * quotes.length)];
    await m.reply(`📖 *CITATION DU JOUR :*\n\n${pick}`);
  }
};
