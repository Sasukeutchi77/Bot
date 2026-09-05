export default {
  name: 'demon',
  category: 'fun',
  description: "Génère un message mystique du démon",
  async execute({ m }) {
    await m.reply("👹 *Les ténèbres s'éveillent... Le bot veille sur vos âmes.*");
  }
};
