export default {
  name: 'group',
  category: 'group',
  description: 'Gère les paramètres généraux du groupe (open / close)',
  async execute({ sock, m, args, isGroup, isBotAdmin, isSenderAdmin }) {
    if (!isGroup) return m.reply('❌ Commande de groupe.');
    if (!isSenderAdmin) return m.reply('❌ Vous devez être administrateur.');
    if (!isBotAdmin) return m.reply('❌ Le bot doit être administrateur.');
    const act = args[0]?.toLowerCase();
    if (act === 'open') {
      await sock.groupSettingUpdate(m.chat, 'not_announcement');
      await m.reply('🔓 Groupe ouvert à tous.');
    } else if (act === 'close') {
      await sock.groupSettingUpdate(m.chat, 'announcement');
      await m.reply('🔒 Groupe fermé (admins seuls).');
    } else {
      await m.reply('_Utilisation :_ *.group open* ou *.group close*');
    }
  }
};
