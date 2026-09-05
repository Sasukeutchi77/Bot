export default {
  name: 'quiz',
  aliases: ['trivia', 'culture'],
  category: 'games',
  description: 'Pose une question de culture générale avec options',

  async execute({ sock, m }) {
    const questions = [
      {
        q: "Quelle est la capitale de l'Australie ?",
        options: ["A) Sydney", "B) Melbourne", "C) Canberra", "D) Brisbane"],
        answer: "C) Canberra"
      },
      {
        q: "Quel est le plus grand océan de la Terre ?",
        options: ["A) Atlantique", "B) Pacifique", "C) Indien", "D) Arctique"],
        answer: "B) Pacifique"
      },
      {
        q: "En quelle année l'homme a-t-il marché sur la Lune pour la première fois ?",
        options: ["A) 1965", "B) 1969", "C) 1972", "D) 1959"],
        answer: "B) 1969"
      }
    ];

    const pick = questions[Math.floor(Math.random() * questions.length)];

    const text = 
      `🧠 *QUIZ DU BOT WHATSAPP*\n\n` +
      `❓ *Question :* ${pick.q}\n\n` +
      pick.options.join('\n') +
      `\n\n💡 _Répondez avec votre choix ou tapez pour révéler la réponse :_ ||${pick.answer}||`;

    await m.reply(text);
  }
};
