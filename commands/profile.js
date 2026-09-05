import { getUserData } from '../lib/usageSystem.js';

export default {
  name: 'profile',
  aliases: ['me'],
  category: 'utility',
  description: "Affiche votre profil d'utilisateur et vos statistiques",
  async execute({ m }) {
    const user = getUserData(m.sender);
    const text = `╭─「 👤 *VOTRE PROFIL* 」\n│\n│ 🆔 *Numéro :* +${m.sender.split('@')[0]}\n│ 🎖️ *Rang :* ${user.rank || 'Bronze'}\n│ ⭐ *EXP :* ${user.exp || 0}\n│ 💰 *Pièces :* ${user.coins || 50}\n│\n╰────────────────────────`;
    await m.reply(text);
  }
};
