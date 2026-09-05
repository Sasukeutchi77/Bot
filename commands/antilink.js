export default {
  name: 'antilink',
  aliases: ['anti-link', 'blocklink'],
  category: 'security',
  adminOnly: true,
  groupOnly: true,
  description: 'Active ou désactive la protection contre les liens WhatsApp et sites interdits',

  // Méthode de vérification utilisée par messageHandler.js sur chaque message entrant
  isLinkDetected(text = '') {
    if (!text || typeof text !== 'string') return false;

    // Détection des liens de groupe WhatsApp, canaux et URLs génériques
    const linkRegex = /(https?:\/\/[^\s]+)|(chat\.whatsapp\.com\/[0-9A-Za-z]{20,24})|(whatsapp\.com\/channel\/[0-9A-Za-z]+)/gi;
    return linkRegex.test(text);
  },

  async execute({ m, args, groupConfig }) {
    const action = (args[0] || '').toLowerCase();

    if (!['on', 'off', 'status', 'kick', 'delete'].includes(action)) {
      return m.reply(
        "🛡️ *CONFIGURATION ANTI-LINK*\n\n" +
        "Options disponibles :\n" +
        "• *.antilink on* : Active la suppression automatique des liens\n" +
        "• *.antilink off* : Désactive la protection\n" +
        "• *.antilink delete* : Supprime le message sans expulser l'auteur\n" +
        "• *.antilink kick* : Supprime le message ET expulse l'auteur\n" +
        "• *.antilink status* : Affiche l'état actuel de la protection"
      );
    }

    if (action === 'status') {
      const currentMode = groupConfig?.antilinkMode || 'off';
      return m.reply(`📊 *État Anti-Link actuel :* *${currentMode.toUpperCase()}*`);
    }

    const newMode = (action === 'on') ? 'delete' : action;
    if (groupConfig) {
      groupConfig.antilinkMode = newMode;
    }

    const modeLabels = {
      off: "🔴 Désactivé",
      delete: "🟡 Actif (Suppression simple)",
      kick: "🔴 Actif (Suppression + Expulsion immédiate)"
    };

    await m.reply(`✅ *Anti-Link mis à jour :* ${modeLabels[newMode] || newMode}`);
  }
};
