export default {
  name: 'unmute',
  aliases: ['ouvrir', 'open'],
  category: 'moderation',
  description: 'Ouvre la discussion du groupe à tous les membres',

  async execute({ sock, m, isGroup, isBotAdmin, isSenderAdmin }) {
    if (!isGroup) return m.reply("❌ Cette commande ne peut être utilisée que dans un groupe.");
    if (!isSenderAdmin) return m.reply("❌ Vous devez être administrateur du groupe.");
    if (!isBotAdmin) return m.reply("❌ Le bot doit être administrateur pour modifier les paramètres.");

    await sock.groupSettingUpdate(m.chat, 'not_announcement');
    await m.reply("🔓 *Groupe ouvert.* Tous les membres peuvent maintenant participer.");
  }
};
