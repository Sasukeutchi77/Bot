export default {
  name: 'calc',
  aliases: ['calcul', 'math'],
  category: 'utility',
  description: 'Évalue une expression mathématique de manière sécurisée sans faille RCE',

  async execute({ m, args }) {
    if (!args.length) {
      return m.reply(
        "❌ Veuillez renseigner un calcul mathématique.\n\n" +
        "📌 *Exemples :*\n" +
        "• *.calc 25 * 4 + 10*\n" +
        "• *.calc (100 - 35) / 5*\n" +
        "• *.calc 2^8*\n" +
        "• *.calc 15% * 200*"
      );
    }

    const rawExpression = args.join(' ');

    // 1. Filtrage strict : seuls les chiffres, espaces et opérateurs autorisés
    const safeCharsRegex = /^[0-9+\-*/().,%^\s]+$/;
    if (!safeCharsRegex.test(rawExpression)) {
      return m.reply("❌ Expression invalide : seuls les chiffres et les opérateurs arithmétiques standards sont autorisés.");
    }

    // 2. Normalisation sécurisée
    let sanitized = rawExpression
      .replace(/\^/g, '**') // Puissance
      .replace(/(\d+)%/g, '($1/100)'); // Pourcentage

    try {
      // Évaluation dans une fonction isolée
      const calculate = new Function(`"use strict"; return (${sanitized});`);
      const result = calculate();

      if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
        return m.reply("❌ Le résultat de cette opération est indéfini ou infini.");
      }

      // Formatage propre avec arrondis si nécessaire
      const formattedResult = Number.isInteger(result) ? result : Number(result.toFixed(6));

      await m.reply(
        `📐 *CALCULATRICE*\n\n` +
        `📝 *Calcul :* \`${rawExpression}\`\n` +
        `🎯 *Résultat :* *${formattedResult}*`
      );
    } catch (err) {
      await m.reply("❌ Erreur de syntaxe dans votre calcul mathématique.");
    }
  }
};
