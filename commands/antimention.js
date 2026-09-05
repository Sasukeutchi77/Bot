import { setAntiMention } from '../lib/antiMentionManager.js';

export default {
  name: 'antimention',
  category: 'security',
  description: 'Supprime les messages avec trop de mentions',
  async execute({ m, args, isGroup, isSenderAdmin }) {
    if (!isGroup) return m.reply('❌ Commande de groupe.');
    if (!isSenderAdmin) return m.reply('❌ Vous devez être administrateur.');
    const val = args[0]?.toLowerCase() === 'on';
    setAntiMention(m.chat, val);
    await m.reply(`📢 Anti-Mention est maintenant ${val ? 'ACTIVÉ ✅' : 'DÉSACTIVÉ ❌'}`);
  }
};
