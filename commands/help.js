import { CommandRegistry } from '../lib/commandRegistry.js';

export default {
  name: 'help',
  aliases: ['aide'],
  category: 'general',
  description: "Affiche l'aide rapide ou les détails d'une commande",
  async execute({ m, args }) {
    const cmd = args[0]?.toLowerCase();
    if (cmd) {
      const found = CommandRegistry.get(cmd);
      if (found) {
        return m.reply(`📖 *Aide pour .${found.name}*\n${found.description || 'Pas de description'}`);
      }
    }
    await m.reply("Tapez *.menu* pour consulter le menu général des commandes.");
  }
};
