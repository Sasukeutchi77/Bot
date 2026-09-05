export default {
  name: 'ship',
  category: 'fun',
  description: "Calcule l'affinité amoureuse entre deux personnes",
  async execute({ m }) {
    const pct = Math.floor(Math.random() * 101);
    await m.reply(`💘 *AFFINITÉ :* *${pct}%* de compatibilité !`);
  }
};
