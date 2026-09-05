import { getUserData } from '../lib/usageSystem.js';

export default {
  name: 'rank',
  category: 'games',
  description: 'Affiche votre rang et niveau de progression',
  async execute({ m }) {
    const user = getUserData(m.sender);
    await m.reply(`🎖️ *RANG ACTUEL :* ${user.rank}\n⭐ *Expérience :* ${user.exp} pts`);
  }
};
