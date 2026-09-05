export default {
  name: 'horoscope',
  category: 'fun',
  description: 'Affiche votre horoscope du jour selon votre signe',
  async execute({ m, args }) {
    const signs = ['belier', 'taureau', 'gemeaux', 'cancer', 'lion', 'vierge', 'balance', 'scorpion', 'sagittaire', 'capricorne', 'verseau', 'poissons'];
    const sign = args[0]?.toLowerCase();
    if (!signs.includes(sign)) return m.reply(`❌ Précisez votre signe astro (ex: *.horoscope lion*).\nSignes valides : ${signs.join(', ')}`);
    await m.reply(`🔮 *Horoscope (${sign.toUpperCase()}) :*\nUne opportunité inattendue se présentera à vous. Gardez confiance en vos intuitions !`);
  }
};
