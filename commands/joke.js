export default {
  name: 'joke',
  aliases: ['blague'],
  category: 'fun',
  description: "Raconte une blague aléatoire",
  async execute({ m }) {
    const jokes = [
      'Que dit un zéro qui rencontre un 8 ? "Sympa ta ceinture !"',
      "Pourquoi les oiseaux volent-ils vers le sud en hiver ? Parce que c'est trop long à pied !",
      'Quel est le comble pour un électricien ? De ne pas être au courant !'
    ];
    const pick = jokes[Math.floor(Math.random() * jokes.length)];
    await m.reply(`😂 *BLAGUE :*\n\n${pick}`);
  }
};
