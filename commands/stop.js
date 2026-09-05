export default {
  name: 'stop',
  category: 'owner',
  description: "Arrête temporairement l'écoute des commandes",
  async execute({ m, isOwner }) {
    if (!isOwner) return m.reply("❌ Réservé au propriétaire.");
    await m.reply("⏸️ Commandes suspendues.");
  }
};
