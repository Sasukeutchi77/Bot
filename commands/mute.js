export default {
  name: 'mute',
  aliases: ['fermer', 'close'],
  category: 'moderation',
  description: 'Ferme la discussion du groupe (seuls les admins peuvent parler)',

  async execute({ sock, m, isGroup, isBotAdmin, isSenderAdmin }) {
    if (!isGroup) return m.reply("❌ Cette commande ne peut être utilisée que dans un groupe.");
    if (!isSenderAdmin) return m.reply("❌ Vous devez être administrateur du groupe.");
    if (!isBotAdmin) return m.reply("❌ Le bot doit être administrateur pour modifier les paramètres.");

    await sock.groupSettingUpdate(m.chat, 'announcement');
    await m.reply("🔒 *Groupe fermé.* Seuls les administrateurs peuvent désormais envoyer des messages.");
  }
};
