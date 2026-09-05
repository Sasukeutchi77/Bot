export default {
  name: 'rps',
  aliases: ['pfc', 'shifumi'],
  category: 'games',
  description: 'Joue à Pierre - Feuille - Ciseaux contre le bot',

  async execute({ m, args }) {
    const choices = ['pierre', 'feuille', 'ciseaux'];
    const emojis = { pierre: '🪨 Pierre', feuille: '📄 Feuille', ciseaux: '✂️ Ciseaux' };
    const userChoice = (args[0] || '').toLowerCase();

    if (!choices.includes(userChoice)) {
      return m.reply("❌ Choix invalide ! Tapez *.rps pierre*, *.rps feuille* ou *.rps ciseaux*.");
    }

    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    let outcome = "Égalité ! 🤝";
    if (
      (userChoice === 'pierre' && botChoice === 'ciseaux') ||
      (userChoice === 'feuille' && botChoice === 'pierre') ||
      (userChoice === 'ciseaux' && botChoice === 'feuille')
    ) {
      outcome = "Vous avez gagné ! 🎉";
    } else if (userChoice !== botChoice) {
      outcome = "Le bot a gagné ! 🤖";
    }

    const text = 
      `🎮 *PIERRE - FEUILLE - CISEAUX*\n\n` +
      `👤 *Votre coup :* ${emojis[userChoice]}\n` +
      `🤖 *Coup du Bot :* ${emojis[botChoice]}\n\n` +
      `🏆 *Résultat :* *${outcome}*`;

    await m.reply(text);
  }
};
