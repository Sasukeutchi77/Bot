import { updateGroupConfig } from '../lib/groupConfig.js';

export default {
  name: 'goodbye',
  category: 'group',
  description: "Active ou désactive le message d'au revoir dans le groupe",
  async execute({ m, args, isGroup, isSenderAdmin }) {
    if (!isGroup) return m.reply("❌ Commande de groupe.");
    if (!isSenderAdmin) return m.reply("❌ Vous devez être administrateur.");
    const state = args[0]?.toLowerCase() === 'on';
    updateGroupConfig(m.chat, { goodbye: state });
    await m.reply(`👋 Message d'au revoir : *${state ? 'ACTIVÉ ✅' : 'DÉSACTIVÉ ❌'}*`);
  }
};
