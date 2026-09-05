/**
 * lib/messageHandler.js
 * 
 * Gestionnaire principal des messages entrants pour Baileys WhatsApp MD.
 * Intègre la vérification du mode Privé / Public (.private / .public)
 */

import { isBotAccessible, getBotMode } from '../commands/private.js';

export async function handleIncomingMessage(sock, m, config = {}) {
  try {
    if (!m.message) return;

    // Détection du texte et préfixe
    const msgText = 
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      m.message.imageMessage?.caption ||
      m.message.videoMessage?.caption ||
      '';

    const prefix = config.prefix || '.';
    if (!msgText.startsWith(prefix)) return;

    const [cmdName, ...args] = msgText.slice(prefix.length).trim().split(/\s+/);
    const command = cmdName.toLowerCase();

    // 1. Détection du rôle Propriétaire (Owner)
    const senderJid = m.key.participant || m.key.remoteJid || '';
    const cleanSender = senderJid.split('@')[0].split(':')[0];
    const ownerNumber = (config.ownerNumber || '33612345678').replace(/[^0-9]/g, '');

    const isOwner = cleanSender === ownerNumber || m.key.fromMe;

    // 2. VÉRIFICATION DU MODE PRIVÉ / PUBLIC
    // Si le bot est en mode privé, seuls le propriétaire et les numéros sudo autorisés peuvent exécuter des commandes
    const accessible = isBotAccessible({
      senderJid,
      botOwnerJid: `${ownerNumber}@s.whatsapp.net`,
      sudoList: config.sudoList || []
    });

    if (!accessible) {
      // Optionnel : ne pas répondre pour rester totalement discret (recommandé en mode self)
      console.log(`[Private Mode] Commande .${command} ignorée pour l'utilisateur non-propriétaire: ${senderJid}`);
      return;
    }

    console.log(`[Handler] Exécution autorisée de .${command} par ${cleanSender}`);
    return { command, args, isOwner, cleanSender };
  } catch (err) {
    console.error("[Message Handler Error]:", err);
  }
}
