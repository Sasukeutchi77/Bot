import { getTopCommands } from '../lib/statsManager.js';

export default {
  name: 'stats',
  category: 'utility',
  description: 'Affiche les statistiques des commandes les plus utilisées',
  async execute({ m }) {
    const top = getTopCommands(5);
    if (!top.length) return m.reply('ℹ️ Pas encore de statistiques enregistrées.');
    const list = top.map(([cmd, count], i) => `${i + 1}. .${cmd} (${count}x)`).join('\n');
    await m.reply(`📊 *TOP COMMANDES UTILISÉES :*\n\n${list}`);
  }
};
