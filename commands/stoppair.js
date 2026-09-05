export default {
  name: 'stoppair',
  category: 'owner',
  description: "Interrompt le processus de pairing en cours",
  async execute({ m, isOwner }) {
    if (!isOwner) return m.reply("❌ Réservé au propriétaire.");
    await m.reply("🛑 Session d'association interrompue.");
  }
};
