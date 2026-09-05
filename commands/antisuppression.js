import { getGroupConfig, updateGroupConfig } from '../lib/groupConfig.js';

export default {
  name: 'antisuppression',
  aliases: ['antidelete'],
  category: 'security',
  description: "Renvoie les messages supprimés par d'autres membres",
  async execute({ m, args, isGroup, isSenderAdmin }) {
    if (!isGroup) return m.reply("❌ Commande de groupe.");
    if (!isSenderAdmin) return m.reply("❌ Vous devez être administrateur.");
    const val = args[0]?.toLowerCase() === 'on';
    updateGroupConfig(m.chat, { antisuppression: val });
    await m.reply(`🗑️ Anti-Suppression est maintenant ${val ? 'ACTIVÉ ✅' : 'DÉSACTIVÉ ❌'}`);
  }
};
