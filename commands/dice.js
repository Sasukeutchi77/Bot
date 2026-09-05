export default {
  name: 'dice',
  aliases: ['de'],
  category: 'games',
  description: 'Lance un dé à 6 faces',
  async execute({ m }) {
    const roll = Math.floor(Math.random() * 6) + 1;
    await m.reply(`🎲 *Résultat du lancer de dé :* [ ${roll} ]`);
  }
};
