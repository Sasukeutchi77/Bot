import { getGroupConfig, updateGroupConfig } from '../lib/groupConfig.js';

export default {
  name: 'antiflood',
  category: 'security',
  description: 'Bloque le spam massif de messages',
  async execute({ m, args, isGroup, isSenderAdmin }) {
    if (!isGroup) return m.reply('❌ Commande de groupe.');
    if (!isSenderAdmin) return m.reply('❌ Vous devez être administrateur.');
    const val = args[0]?.toLowerCase() === 'on';
    updateGroupConfig(m.chat, { antiflood: val });
    await m.reply(`🌊 Anti-Flood est maintenant ${val ? 'ACTIVÉ ✅' : 'DÉSACTIVÉ ❌'}`);
  }
};
