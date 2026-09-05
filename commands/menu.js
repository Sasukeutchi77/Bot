/**
 * Commande : .menu / .help / .aide
 * 
 * Rôle : Affiche le panneau de contrôle et le catalogue des commandes du bot WhatsApp.
 * 
 * Corrections & Améliorations de Design :
 * 1. Élimination du pavé de texte confus : organisation stricte en 7 catégories thématiques
 * 2. En-tête stylé avec métriques en temps réel (Uptime, Ping, Mode Public/Privé, Préfixe, RAM)
 * 3. Encadrement moderne et aéré (caractères Unicode épurés ╭ │ ╰ sans surcharge kitsch)
 * 4. Support des sous-menus ciblés :
 *    - .menu (affiche le dashboard complet ou le sommaire stylé)
 *    - .menu <catégorie> (ex: .menu media, .menu admin, .menu ai, .menu jeux)
 * 5. Formatage compact et lisible sur smartphone WhatsApp (sans saut de ligne inutile)
 */

import os from 'os';
import { getBotMode } from './private.js';

// Formatage du temps de fonctionnement (Uptime)
function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d > 0 ? `${d}j ` : ''}${h}h ${m}m ${s}s`;
}

// Catalogue structuré des commandes par catégorie
export const MENU_CATEGORIES = {
  owner: {
    emoji: '👑',
    title: 'PROPRIÉTAIRE & SYSTÈME',
    commands: [
      { name: 'private', desc: 'Bascule en mode privé (Self-mode)' },
      { name: 'public', desc: 'Rétablit le mode public pour tous' },
      { name: 'ping', desc: 'Mesure la latence du serveur' },
      { name: 'uptime', desc: 'Temps d’activité sans coupure' },
      { name: 'restart', desc: 'Redémarre le bot' }
    ]
  },
  moderation: {
    emoji: '🛡️',
    title: 'MODÉRATION DE GROUPE',
    commands: [
      { name: 'kick', desc: 'Expulse un membre (@mention/réponse)' },
      { name: 'ban', desc: 'Bannit définitivement du groupe' },
      { name: 'tagall', desc: 'Appel général avec mention de tous' },
      { name: 'hidetag', desc: 'Mention invisible pour annonces' },
      { name: 'promote', desc: 'Nomme un membre administrateur' },
      { name: 'demote', desc: 'Rétrograde un administrateur' },
      { name: 'mute', desc: 'Ferme la discussion aux membres' },
      { name: 'unmute', desc: 'Ouvre la discussion à tous' },
      { name: 'warn', desc: 'Avertit un membre (expulsion à 3/3)' },
      { name: 'clearwarns', desc: 'Remet à zéro les avertissements' }
    ]
  },
  security: {
    emoji: '🔒',
    title: 'SÉCURITÉ & ANTI-ABUS',
    commands: [
      { name: 'antilink', desc: 'Bloque et supprime les liens (.antilink on)' },
      { name: 'antichannel', desc: 'Supprime les liens de chaînes WA' },
      { name: 'antiword', desc: 'Filtre automatique de mots interdits' },
      { name: 'antispam', desc: 'Protection anti-flood de messages' },
      { name: 'antidelete', desc: 'Capture les messages supprimés' }
    ]
  },
  media: {
    emoji: '📥',
    title: 'MULTIMÉDIA & TÉLÉCHARGEMENT',
    commands: [
      { name: 'vv', desc: 'Intercepte médias à vue unique' },
      { name: 'ytmp4', desc: 'Télécharge une vidéo YouTube en HD' },
      { name: 'song', desc: 'Télécharge une musique au format audio' },
      { name: 'sticker', desc: 'Convertit une image/vidéo en sticker' },
      { name: 'lyrics', desc: 'Trouve les paroles d’une chanson' },
      { name: 'image', desc: 'Recherche Google Images' }
    ]
  },
  ai: {
    emoji: '🧠',
    title: 'INTELLIGENCE ARTIFICIELLE',
    commands: [
      { name: 'ai', desc: 'Discute avec l’assistant IA' },
      { name: 'ocr', desc: 'Extrait le texte d’une image' },
      { name: 'tts', desc: 'Synthèse vocale (texte vers vocal)' },
      { name: 'transcribe', desc: 'Transcrit une note vocale en texte' }
    ]
  },
  utility: {
    emoji: '⚙️',
    title: 'OUTILS & UTILITAIRES',
    commands: [
      { name: 'calc', desc: 'Calculatrice sécurisée' },
      { name: 'translate', desc: 'Traduit un texte dans 50+ langues' },
      { name: 'weather', desc: 'Météo en direct d’une ville' },
      { name: 'qrcode', desc: 'Génère un QR code personnalisé' }
    ]
  },
  games: {
    emoji: '🎮',
    title: 'JEUX & DIVERTISSEMENT',
    commands: [
      { name: 'tictactoe', desc: 'Morpion multijoueur interactif' },
      { name: 'quiz', desc: 'Quiz de culture générale' },
      { name: 'rps', desc: 'Pierre - Feuille - Ciseaux' },
      { name: 'dice', desc: 'Lancer de dés aléatoire' },
      { name: 'coinflip', desc: 'Pile ou Face' }
    ]
  }
};

export default {
  name: 'menu',
  aliases: ['help', 'aide', 'commandes', 'alive', 'list'],
  category: 'utility',
  description: 'Affiche la liste complète et structurée des commandes du bot',

  async execute({ sock, m, args = [], prefix = '.' }) {
    const startTime = Date.now();
    const query = (args[0] || '').toLowerCase().trim();

    // Métriques du bot
    const uptimeStr = formatUptime(process.uptime ? process.uptime() : 3600);
    const mode = getBotMode ? getBotMode() : 'public';
    const ramUsage = `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`;
    const latency = `${Date.now() - startTime} ms`;
    const senderName = m.pushName || m.sender.split('@')[0];

    // Cas 1 : L'utilisateur a demandé une catégorie précise (ex: .menu media)
    const categoryKey = Object.keys(MENU_CATEGORIES).find(
      key => key === query || key.startsWith(query)
    );

    if (query && categoryKey) {
      const cat = MENU_CATEGORIES[categoryKey];
      let subMenuText = 
        `╭───────────「 ${cat.emoji} *${cat.title}* 」\n` +
        `│\n`;

      cat.commands.forEach(cmd => {
        subMenuText += `│  ▸ *${prefix}${cmd.name}* : _${cmd.desc}_\n`;
      });

      subMenuText += 
        `│\n` +
        `╰─────────────────────────\n\n` +
        `💡 _Pour afficher le menu complet, tapez :_ *${prefix}menu*`;

      return sock.sendMessage(m.chat, {
        text: subMenuText
      }, { quoted: m });
    }

    // Cas 2 : Menu Général Complet avec Mise en Page Épurée & Design Haut de Gamme
    const totalCommands = Object.values(MENU_CATEGORIES).reduce((sum, c) => sum + c.commands.length, 0);

    let menuOutput = 
      `╭─「 ⚡ *WHATSAPP BOT MD* ⚡ 」\n` +
      `│\n` +
      `│ 👤 *Utilisateur :* @${m.sender.split('@')[0]}\n` +
      `│ 🌐 *Mode :* ${mode === 'private' ? '🔒 Privé (Self)' : '🌍 Public'}\n` +
      `│ ⏱️ *Uptime :* ${uptimeStr}\n` +
      `│ ⚡ *Vitesse :* ${latency}\n` +
      `│ 💾 *RAM :* ${ramUsage}\n` +
      `│ 📑 *Total Commandes :* ${totalCommands}\n` +
      `│ 🔘 *Préfixe :* [ ${prefix} ]\n` +
      `│\n` +
      `╰───────────────────────\n\n`;

    // Itération propre sur chaque catégorie
    for (const [key, cat] of Object.entries(MENU_CATEGORIES)) {
      menuOutput += `╭─「 ${cat.emoji} *${cat.title}* 」\n`;
      
      cat.commands.forEach(cmd => {
        menuOutput += `│  • *${prefix}${cmd.name}* : ${cmd.desc}\n`;
      });

      menuOutput += `╰───────────────────────\n\n`;
    }

    // Pied de page interactif
    menuOutput += 
      `╭─「 ℹ️ *ASTUCES & FILTRAGE* 」\n` +
      `│ • Tapez *${prefix}menu <catégorie>* pour cibler un module\n` +
      `│   _Exemples :_ *${prefix}menu media*, *${prefix}menu moderation*\n` +
      `│ • Tapez *${prefix}aide <commande>* pour les détails d’une commande\n` +
      `╰───────────────────────`;

    await sock.sendMessage(m.chat, {
      text: menuOutput,
      mentions: [m.sender]
    }, { quoted: m });
  }
};
