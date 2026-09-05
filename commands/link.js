export default {
  name: 'link',
  aliases: ['lien'],
  category: 'group',
  description: "Récupère le lien d'invitation du groupe",
  async execute({ sock, m, isGroup, isBotAdmin }) {
    if (!isGroup) return m.reply("❌ Commande de groupe.");
    if (!isBotAdmin) return m.reply("❌ Le bot doit être administrateur pour générer le lien.");
    const code = await sock.groupInviteCode(m.chat);
    await m.reply(`🔗 *Lien d'invitation du groupe :*\nhttps://chat.whatsapp.com/${code}`);
  }
};
