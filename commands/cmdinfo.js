import { CommandRegistry } from '../lib/commandRegistry.js';

export default {
  name: 'cmdinfo',
  category: 'utility',
  description: "Affiche les métadonnées d'une commande",
  async execute({ m, args }) {
    const name = args[0]?.toLowerCase();
    if (!name) return m.reply("❌ Précisez le nom d'une commande.");
    const cmd = CommandRegistry.get(name);
    if (!cmd) return m.reply(`❌ Commande *${name}* introuvable.`);
    const text = `╭─「 ℹ️ *INFO COMMANDE* 」\n│\n│ 🏷️ *Nom :* ${cmd.name}\n│ 📁 *Catégorie :* ${cmd.category || 'Général'}\n│ 📝 *Description :* ${cmd.description || 'Aucune'}\n│ 🔄 *Alias :* ${cmd.aliases?.join(', ') || 'Aucun'}\n╰────────────────────────`;
    await m.reply(text);
  }
};
