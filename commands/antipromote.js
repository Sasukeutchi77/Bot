import { getGroupConfig, updateGroupConfig } from '../lib/groupConfig.js';

export default {
  name: 'antipromote',
  category: 'security',
  description: "Empêche la promotion non autorisée d'administrateurs",
  async execute({ m, args, isGroup, isSenderAdmin }) {
    if (!isGroup) return m.reply("❌ Commande de groupe.");
    if (!isSenderAdmin) return m.reply("❌ Vous devez être administrateur.");
    const val = args[0]?.toLowerCase() === 'on';
    updateGroupConfig(m.chat, { antipromote: val });
    await m.reply(`🛡️ Anti-Promote est maintenant ${val ? 'ACTIVÉ ✅' : 'DÉSACTIVÉ ❌'}`);
  }
};
