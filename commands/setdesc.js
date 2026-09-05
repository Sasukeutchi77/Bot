export default {
  name: 'setdesc',
  category: 'group',
  description: 'Modifie la description du groupe',
  async execute({ sock, m, args, isGroup, isBotAdmin, isSenderAdmin }) {
    if (!isGroup) return m.reply('❌ Commande de groupe.');
    if (!isSenderAdmin) return m.reply('❌ Vous devez être administrateur.');
    if (!isBotAdmin) return m.reply('❌ Le bot doit être administrateur.');
    const desc = args.join(' ');
    if (!desc) return m.reply('❌ Précisez la nouvelle description.');
    await sock.groupUpdateDescription(m.chat, desc);
    await m.reply('✅ Description du groupe mise à jour.');
  }
};
