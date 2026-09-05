export default {
  name: 'info',
  category: 'general',
  description: 'Informations générales sur le bot WhatsApp',
  async execute({ m }) {
    await m.reply('🤖 *WhatsApp MD Bot v2.5*\nDéveloppé avec Baileys v6 Multi-Device.\nTapez *.menu* pour voir la liste des commandes disponibles.');
  }
};
