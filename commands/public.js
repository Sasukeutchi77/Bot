/**
 * Commande : .public (Mode Public)
 * Rôle : Réactive l'accès aux commandes du bot pour tous les utilisateurs.
 */

import { getBotMode, setBotMode } from './private.js';

export default {
  name: 'public',
  aliases: ['pub', 'publicmode'],
  category: 'owner',
  ownerOnly: true,
  description: 'Réactive le mode public (tout le monde peut exécuter les commandes autorisées)',

  async execute({ sock, m, isOwner }) {
    // Vérification Propriétaire
    if (!isOwner) {
      return m.reply("❌ Seul le propriétaire du bot (Owner) est autorisé à réactiver le mode public.");
    }

    const currentMode = getBotMode();

    if (currentMode === 'public') {
      return m.reply("🌐 *Le bot est déjà configuré en mode PUBLIC.*\nTapez `.private` si vous souhaitez le restreindre à vous seul.");
    }

    const saved = setBotMode('public');

    if (!saved) {
      return m.reply("⚠️ Échec de la sauvegarde persistante du mode public dans config.json.");
    }

    await sock.sendMessage(m.chat, {
      text: 
        `🌐 *MODE PUBLIC RÉACTIVÉ*\n\n` +
        `👤 *Action par :* @${m.sender.split('@')[0]}\n` +
        `✅ *Statut :* Les commandes du bot sont de nouveau disponibles pour tous les utilisateurs.\n\n` +
        `💡 _Pour restreindre l'usage au propriétaire :_ *.private*`,
      mentions: [m.sender]
    }, { quoted: m });
  }
};
