import { getUserData } from '../lib/usageSystem.js';

export default {
  name: 'role',
  category: 'games',
  description: 'Affiche votre rôle actuel dans la communauté',
  async execute({ m }) {
    const user = getUserData(m.sender);
    await m.reply(`🎭 *Votre rôle :* Membre ${user.rank}`);
  }
};
