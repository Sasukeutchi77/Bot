export default {
  name: 'pairing',
  category: 'owner',
  description: "Génère un code d'association (Pairing Code) pour connecter WhatsApp",
  async execute({ m, args, isOwner }) {
    if (!isOwner) return m.reply("❌ Réservé au propriétaire.");
    const phone = args[0]?.replace(/[^0-9]/g, '');
    if (!phone) return m.reply("❌ Spécifiez votre numéro de téléphone.");
    await m.reply(`📲 Demande de Pairing Code pour +${phone} en cours d'exécution...`);
  }
};
