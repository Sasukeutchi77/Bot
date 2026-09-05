import { setAntiTag } from '../lib/antiTagManager.js';

export default {
  name: 'antitag',
  category: 'security',
  description: 'Empêche les membres non-admins de faire des mentions collectives',
  async execute({ m, args, isGroup, isSenderAdmin }) {
    if (!isGroup) return m.reply('❌ Commande de groupe.');
    if (!isSenderAdmin) return m.reply('❌ Vous devez être administrateur.');
    const val = args[0]?.toLowerCase() === 'on';
    setAntiTag(m.chat, val);
    await m.reply(`🏷️ Anti-Tag est maintenant ${val ? 'ACTIVÉ ✅' : 'DÉSACTIVÉ ❌'}`);
  }
};
