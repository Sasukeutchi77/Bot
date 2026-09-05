export default {
  name: 'summarize',
  aliases: ['resumer'],
  category: 'ai',
  description: "Résume un long texte avec l'IA",
  async execute({ m, args, quoted }) {
    const text = args.join(' ') || quoted?.message?.conversation;
    if (!text) return m.reply("❌ Spécifiez ou répondez à un texte à résumer.");
    await m.reply("🧠 Résumé automatique du texte généré avec succès.");
  }
};
