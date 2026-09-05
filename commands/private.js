/**
 * Commande : .private (Mode Privé / Self-Mode)
 * Rôle : Bascule le bot en mode privé afin que seul le propriétaire (Owner)
 * et les utilisateurs Sudo autorisés puissent exécuter des commandes.
 * 
 * Corrections & Améliorations apportées :
 * 1. Vérification stricte du propriétaire (isOwner) avec normalisation des JIDs et LIDs
 * 2. Persistance dans le fichier de configuration (évite la réinitialisation au redémarrage)
 * 3. Sécurité anti-verrouillage : empêche le bot de se bloquer lui-même
 * 4. Export d'un helper `isBotAccessible()` utilisable directement dans messageHandler.js
 */

import fs from 'fs';
import path from 'path';

// Fichier de configuration d'état persistant
const CONFIG_PATH = path.resolve('./config.json');

export function getBotMode() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
      return data.mode || 'public';
    }
  } catch (err) {
    console.error("[Private Mode Config Read Error]:", err);
  }
  return 'public';
}

export function setBotMode(newMode) {
  try {
    let currentConfig = {};
    if (fs.existsSync(CONFIG_PATH)) {
      currentConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    }
    currentConfig.mode = newMode;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(currentConfig, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("[Private Mode Config Write Error]:", err);
    return false;
  }
}

/**
 * Fonction à appeler au début de lib/messageHandler.js :
 * Vérifie si un message est autorisé à être traité par le bot
 */
export function isBotAccessible({ senderJid, botOwnerJid, sudoList = [] }) {
  const mode = getBotMode();
  if (mode === 'public') return true;

  // En mode privé, seuls le propriétaire et les sudos ont accès
  const cleanSender = (senderJid || '').split('@')[0].split(':')[0];
  const cleanOwner = (botOwnerJid || '').split('@')[0].split(':')[0];

  const isOwner = cleanSender === cleanOwner;
  const isSudo = sudoList.some(s => s.split('@')[0].split(':')[0] === cleanSender);

  return isOwner || isSudo;
}

export default {
  name: 'private',
  aliases: ['privita', 'prive', 'privé', 'self', 'privatemode'],
  category: 'owner',
  ownerOnly: true,
  description: 'Active le mode privé (seul le propriétaire peut utiliser le bot)',

  async execute({ sock, m, isOwner }) {
    // 1. Contrôle strict d'accès Propriétaire
    if (!isOwner) {
      return m.reply("❌ Seul le propriétaire du bot (Owner) est autorisé à basculer en mode privé.");
    }

    const currentMode = getBotMode();

    if (currentMode === 'private') {
      return m.reply("🔒 *Le bot est déjà configuré en mode PRIVÉ.*\nSeul vous pouvez exécuter des commandes.\nTapez `.public` pour rouvrir l'accès à tous.");
    }

    // 2. Enregistrement persistant
    const saved = setBotMode('private');

    if (!saved) {
      return m.reply("⚠️ Échec de la sauvegarde persistante du mode privé dans config.json.");
    }

    await sock.sendMessage(m.chat, {
      text: 
        `🔒 *MODE PRIVÉ ACTIVÉ AVEC SUCCÈS*\n\n` +
        `👤 *Contrôleur :* @${m.sender.split('@')[0]}\n` +
        `🛡️ *Statut :* Les commandes sont désormais *inaccessibles* aux autres membres et groupes.\n\n` +
        `💡 _Pour réactiver l'accès pour tous, tapez :_ *.public*`,
      mentions: [m.sender]
    }, { quoted: m });
  }
};
