export default {
  name: 'coinflip',
  aliases: ['pileouface', 'flip'],
  category: 'games',
  description: 'Lance une pièce à pile ou face',
  async execute({ m }) {
    const result = Math.random() < 0.5 ? '🪙 Pile !' : '🪙 Face !';
    await m.reply(`🎲 La pièce tourne...\n\nRésultat : *${result}*`);
  }
};
