export default {
  name: 'eval',
  category: 'owner',
  description: 'Évalue du code JavaScript (Propriétaire uniquement)',
  async execute({ sock, m, args, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    const code = args.join(' ');
    if (!code) return m.reply('❌ Précisez le code à exécuter.');
    try {
      let result = eval(code);
      if (typeof result !== 'string') result = JSON.stringify(result, null, 2);
      await m.reply(`💻 *Résultat :*\n\`\`\`${result}\`\`\``);
    } catch (err) {
      await m.reply(`❌ *Erreur :*\n\`\`\`${err.message}\`\`\``);
    }
  }
};
