import { getGroupConfig, updateGroupConfig } from '../lib/groupConfig.js';

export default {
  name: 'antidemote',
  category: 'security',
  description: 'Empêche la rétrogradation non autorisée des administrateurs',
  async execute({ m, args, isGroup, isSenderAdmin }) {
    if (!isGroup) return m.reply('❌ Commande de groupe.');
    if (!isSenderAdmin) return m.reply('❌ Vous devez être administrateur.');
    const val = args[0]?.toLowerCase() === 'on';
    updateGroupConfig(m.chat, { antidemote: val });
    await m.reply(`🛡️ Anti-Demote est maintenant ${val ? 'ACTIVÉ ✅' : 'DÉSACTIVÉ ❌'}`);
  }
};
