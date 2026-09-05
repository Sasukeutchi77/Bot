import { getGroupConfig, updateGroupConfig } from '../lib/groupConfig.js';

export default {
  name: 'antispam',
  category: 'security',
  description: 'Active la détection et la suppression de spam',
  async execute({ m, args, isGroup, isSenderAdmin }) {
    if (!isGroup) return m.reply('❌ Commande de groupe.');
    if (!isSenderAdmin) return m.reply('❌ Vous devez être administrateur.');
    const val = args[0]?.toLowerCase() === 'on';
    updateGroupConfig(m.chat, { antispam: val });
    await m.reply(`🛑 Anti-Spam est maintenant ${val ? 'ACTIVÉ ✅' : 'DÉSACTIVÉ ❌'}`);
  }
};
