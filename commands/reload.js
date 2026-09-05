import { CommandRegistry } from '../lib/commandRegistry.js';

export default {
  name: 'reload',
  category: 'owner',
  description: 'Recharge toutes les commandes sans redémarrer le bot',
  async execute({ m, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    await CommandRegistry.loadAll();
    await m.reply(`🔄 Toutes les commandes ont été rechargées (${CommandRegistry.commands.size} commandes actives).`);
  }
};
