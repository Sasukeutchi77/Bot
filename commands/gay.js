export default {
  name: 'gay',
  category: 'fun',
  description: "Calcule le pourcentage d'humour gay",
  async execute({ m }) {
    const pct = Math.floor(Math.random() * 101);
    await m.reply(`🌈 *Calculateur :* Vous êtes à *${pct}%* gay aujourd'hui !`);
  }
};
