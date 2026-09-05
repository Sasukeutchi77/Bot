import { updateGroupConfig } from '../lib/groupConfig.js';

export default {
  name: 'welcome',
  category: 'group',
  description: 'Active ou désactive le message de bienvenue pour les nouveaux arrivants',
  async execute({ m, args, isGroup, isSenderAdmin }) {
    if (!isGroup) return m.reply('❌ Commande de groupe.');
    if (!isSenderAdmin) return m.reply('❌ Vous devez être administrateur.');
    const state = args[0]?.toLowerCase() === 'on';
    updateGroupConfig(m.chat, { welcome: state });
    await m.reply(`👋 Message de bienvenue : *${state ? 'ACTIVÉ ✅' : 'DÉSACTIVÉ ❌'}*`);
  }
};
