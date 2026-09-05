export default {
  name: 'lock',
  category: 'group',
  description: 'Verrouille les paramètres du groupe (admins seuls)',
  async execute({ sock, m, isGroup, isBotAdmin, isSenderAdmin }) {
    if (!isGroup) return m.reply('❌ Commande de groupe.');
    if (!isSenderAdmin) return m.reply('❌ Vous devez être administrateur.');
    if (!isBotAdmin) return m.reply('❌ Le bot doit être administrateur.');
    await sock.groupSettingUpdate(m.chat, 'locked');
    await m.reply('🔒 Paramètres du groupe verrouillés.');
  }
};
