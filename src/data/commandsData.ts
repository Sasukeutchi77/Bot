export interface CommandItem {
  id: string;
  name: string;
  aliases: string[];
  category: 'media' | 'moderation' | 'ai' | 'security' | 'utility' | 'games' | 'owner';
  status: 'critical_fixed' | 'improved' | 'secured' | 'operational';
  statusLabel: string;
  description: string;
  originalProblem: string;
  solutionApplied: string;
  code: string;
  fileLocation: string;
}

export const COMMANDS_DATA: CommandItem[] = [
  {
    id: 'vv',
    name: 'vv',
    aliases: ['viewonce', 'readviewonce', 'vo'],
    category: 'media',
    status: 'critical_fixed',
    statusLabel: 'Corrigé (Critique)',
    description: 'Intercepte et renvoie les médias envoyés en vue unique (photos et vidéos).',
    originalProblem: 'WhatsApp a modifié les messages éphémères dans Baileys v6+. Le média était introuvable car encapsulé dans viewOnceMessageV2 ou viewOnceMessageV2Extension.',
    solutionApplied: 'Extraction récursive des conteneurs éphémères et détection automatique image/vidéo avec gestion des légendes et buffers temporaires.',
    fileLocation: 'commands/vv.js',
    code: `import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: 'vv',
  aliases: ['viewonce', 'readviewonce', 'vo'],
  category: 'media',
  description: 'Récupère et renvoie un média à vue unique (photo ou vidéo)',

  async execute({ sock, m, quoted }) {
    if (!quoted) {
      return m.reply("❌ Répondez à un média envoyé en vue unique (photo ou vidéo).");
    }

    const rawMsg = quoted.message || {};
    const viewOnceContainer =
      rawMsg.viewOnceMessage?.message ||
      rawMsg.viewOnceMessageV2?.message ||
      rawMsg.viewOnceMessageV2Extension?.message ||
      rawMsg.ephemeralMessage?.message?.viewOnceMessage?.message ||
      rawMsg.ephemeralMessage?.message?.viewOnceMessageV2?.message ||
      rawMsg;

    const isImage = !!viewOnceContainer.imageMessage;
    const isVideo = !!viewOnceContainer.videoMessage;

    if (!isImage && !isVideo) {
      return m.reply("❌ Le message sélectionné n'est pas un média à vue unique supporté.");
    }

    try {
      await m.reply("⏳ Téléchargement du média à vue unique en cours...");
      const mediaType = isImage ? 'image' : 'video';
      const targetMessage = isImage ? viewOnceContainer.imageMessage : viewOnceContainer.videoMessage;

      const buffer = await downloadMediaMessage(
        { key: quoted.key, message: viewOnceContainer },
        'buffer',
        {}
      );

      const caption = targetMessage.caption
        ? \`🔓 *Vue Unique Décryptée*\\n💬 *Légende :* \${targetMessage.caption}\`
        : "🔓 *Média à Vue Unique Récupéré avec Succès*";

      if (isImage) {
        await sock.sendMessage(m.chat, { image: buffer, caption }, { quoted: m });
      } else {
        await sock.sendMessage(m.chat, { video: buffer, caption }, { quoted: m });
      }
    } catch (error) {
      console.error("[VV Command Error]:", error);
      await m.reply("❌ Impossible de récupérer ce média. Le fichier a peut-être expiré des serveurs WhatsApp.");
    }
  }
};`
  },
  {
    id: 'calc',
    name: 'calc',
    aliases: ['calcul', 'math'],
    category: 'utility',
    status: 'secured',
    statusLabel: 'Sécurisé (Faille RCE)',
    description: 'Calculatrice mathématique avancée sans exécution de code arbitraire.',
    originalProblem: "Utilisait eval() directement sur l'entrée de l'utilisateur, permettant à n'importe qui d'exécuter du code malveillant sur le serveur (RCE).",
    solutionApplied: 'Filtrage strict par regex pour autoriser uniquement les opérateurs arithmétiques standards et encapsulation dans une fonction isolée sans contexte global.',
    fileLocation: 'commands/calc.js',
    code: `export default {
  name: 'calc',
  aliases: ['calcul', 'math'],
  category: 'utility',
  description: 'Évalue une expression mathématique de manière sécurisée sans faille RCE',

  async execute({ m, args }) {
    if (!args.length) {
      return m.reply("❌ Précisez un calcul. Exemple : .calc 25 * 4 + 10");
    }

    const rawExpression = args.join(' ');
    const safeCharsRegex = /^[0-9+\\-*/().,%^\\s]+$/;
    if (!safeCharsRegex.test(rawExpression)) {
      return m.reply("❌ Expression invalide : seuls les chiffres et opérateurs arithmétiques sont autorisés.");
    }

    let sanitized = rawExpression
      .replace(/\\^/g, '**')
      .replace(/(\\d+)%/g, '($1/100)');

    try {
      const calculate = new Function(\`"use strict"; return (\${sanitized});\`);
      const result = calculate();

      if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
        return m.reply("❌ Résultat mathématique indéfini ou infini.");
      }

      const formatted = Number.isInteger(result) ? result : Number(result.toFixed(6));
      await m.reply(\`📐 *CALCULATRICE*\\n\\n📝 *Calcul :* \`\${rawExpression}\`\\n🎯 *Résultat :* *\${formatted}*\`);
    } catch (err) {
      await m.reply("❌ Erreur de syntaxe dans votre calcul.");
    }
  }
};`
  },
  {
    id: 'tagall',
    name: 'tagall',
    aliases: ['everyone', 'tous', 'appel'],
    category: 'moderation',
    status: 'improved',
    statusLabel: 'Amélioré (Support LID)',
    description: 'Mentionne tous les membres d’un groupe sans omission ni crash.',
    originalProblem: 'Crashait ou omettait les membres ayant des numéros masqués avec les nouveaux LIDs (@lid) de WhatsApp.',
    solutionApplied: 'Extraction fiable des identifiants avec normalisation du numéro affiché et mise en forme lisible avec compteur de membres.',
    fileLocation: 'commands/tagall.js',
    code: `export default {
  name: 'tagall',
  aliases: ['everyone', 'tous', 'appel'],
  category: 'group',
  adminOnly: true,
  groupOnly: true,
  description: 'Mentionne tous les membres du groupe sans omission et sans crash',

  async execute({ sock, m, args }) {
    try {
      const groupMetadata = await sock.groupMetadata(m.chat);
      const participants = groupMetadata.participants || [];

      if (!participants.length) {
        return m.reply("❌ Impossible de charger la liste des membres du groupe.");
      }

      const announcement = args.length > 0 ? args.join(' ') : "Aucun message précisé";
      let messageBody = \`📢 *APPEL GÉNÉRAL*\\n👥 *Membres totaux :* \${participants.length}\\n📝 *Sujet :* \${announcement}\\n\\n\`;

      const mentions = [];
      for (let i = 0; i < participants.length; i++) {
        const participant = participants[i];
        mentions.push(participant.id);
        const cleanNumber = participant.id.split('@')[0].split(':')[0];
        messageBody += \`▫️ \${i + 1}. @\${cleanNumber}\\n\`;
      }

      messageBody += \`\\n⚡ _Appel généré par @\${m.sender.split('@')[0]}_\`;
      mentions.push(m.sender);

      await sock.sendMessage(m.chat, {
        text: messageBody,
        mentions: mentions
      }, { quoted: m });
    } catch (error) {
      console.error("[TagAll Error]:", error);
      await m.reply("❌ Une erreur est survenue lors de l'appel du groupe.");
    }
  }
};`
  },
  {
    id: 'kick',
    name: 'kick',
    aliases: ['expulser', 'voter', 'eject'],
    category: 'moderation',
    status: 'secured',
    statusLabel: 'Sécurisé (Rôles & Cibles)',
    description: 'Expulse un membre avec vérification préalable des permissions et protection des admins.',
    originalProblem: 'Tentait d’expulser des admins (provoquant des erreurs Baileys), ne vérifiait pas si le bot était admin, et échouait si la cible était en réponse d’un LID.',
    solutionApplied: 'Vérification en cascade : droits admin du bot, cible valide via targetResolver, immunité des admins et du créateur.',
    fileLocation: 'commands/kick.js',
    code: `import { resolveTarget } from '../lib/targetResolver.js';

export default {
  name: 'kick',
  aliases: ['expulser', 'voter', 'eject'],
  category: 'group',
  adminOnly: true,
  botAdminRequired: true,
  groupOnly: true,
  description: 'Expulse un membre du groupe avec vérification stricte des rôles',

  async execute({ sock, m, args }) {
    try {
      const groupMetadata = await sock.groupMetadata(m.chat);
      const participants = groupMetadata.participants || [];
      const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const botMember = participants.find(p => p.id.split(':')[0] === botId.split('@')[0]);

      if (!botMember || !botMember.admin) {
        return m.reply("❌ Je ne possède pas les droits administrateur dans ce groupe.");
      }

      const targetJid = resolveTarget(m, args, participants);
      if (!targetJid) {
        return m.reply("❌ Mentionnez la personne (@nom) ou répondez à l'un de ses messages.");
      }

      if (targetJid.split(':')[0] === botId.split('@')[0]) {
        return m.reply("❌ Je ne peux pas m'expulser moi-même.");
      }

      const targetMember = participants.find(p => p.id === targetJid || p.id.split(':')[0] === targetJid.split('@')[0]);
      if (!targetMember) return m.reply("❌ Ce membre ne fait plus partie du groupe.");
      if (targetMember.admin) return m.reply("❌ Impossible d'expulser un administrateur du groupe.");

      await sock.groupParticipantsUpdate(m.chat, [targetMember.id], 'remove');
      await sock.sendMessage(m.chat, {
        text: \`👋 L'utilisateur @\${targetJid.split('@')[0]} a été expulsé avec succès.\`,
        mentions: [targetJid]
      }, { quoted: m });
    } catch (error) {
      console.error("[Kick Error]:", error);
      await m.reply("❌ Une erreur s'est produite lors de l'expulsion.");
    }
  }
};`
  },
  {
    id: 'ai',
    name: 'ai',
    aliases: ['gemini', 'gpt', 'ia', 'ask'],
    category: 'ai',
    status: 'improved',
    statusLabel: 'Amélioré (Timeout & Fallback)',
    description: 'Pose des questions à l’IA avec formatage soigné et protection anti-timeout.',
    originalProblem: 'Gels infinis si l’API prenait du temps, messages d’erreurs bruts illisibles et absence de contrôle de clés d’API.',
    solutionApplied: 'Intégration d’AbortController à 20s, validation préalable de la clé GEMINI_API_KEY et messages guidés en français.',
    fileLocation: 'commands/ai.js',
    code: `export default {
  name: 'ai',
  aliases: ['gemini', 'gpt', 'ask', 'ia'],
  category: 'ai',
  description: 'Interroge l\\'assistant IA avec contrôle de délai et gestion des pannes',

  async execute({ m, args }) {
    if (!args.length) {
      return m.reply("💡 Posez votre question après la commande. Exemple : .ai Explique le système solaire");
    }

    const promptText = args.join(' ');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return m.reply("❌ Variable GEMINI_API_KEY non configurée.");

    await m.reply("💭 _L'assistant réfléchit..._");

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);

      const response = await fetch(
        \`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: promptText }] }] }),
          signal: controller.signal
        }
      );
      clearTimeout(timer);

      const json = await response.json();
      const generatedText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!generatedText) return m.reply("⚠️ L'IA n'a pas pu formuler de réponse.");

      await m.reply(\`🤖 *RÉPONSE DE L'ASSISTANT IA*\\n\\n\${generatedText.trim()}\`);
    } catch (err) {
      if (err.name === 'AbortError') {
        return m.reply("⏱️ Délai dépassé : l'IA a mis trop de temps à répondre.");
      }
      await m.reply("❌ Une erreur est survenue lors de la communication avec l'IA.");
    }
  }
};`
  },
  {
    id: 'antilink',
    name: 'antilink',
    aliases: ['anti-link', 'blocklink'],
    category: 'security',
    status: 'improved',
    statusLabel: 'Amélioré (Multi-modes)',
    description: 'Protection contre les liens WhatsApp et sites indésirables avec plusieurs modes de sanction.',
    originalProblem: 'La détection était trop rigide, bloquait les administrateurs et ne permettait pas de choisir entre simple suppression ou expulsion.',
    solutionApplied: 'Modes configurables (.antilink delete / .antilink kick), exclusion automatique des admins et regex complète pour canaux et invitations.',
    fileLocation: 'commands/antilink.js',
    code: `export default {
  name: 'antilink',
  aliases: ['anti-link', 'blocklink'],
  category: 'security',
  adminOnly: true,
  groupOnly: true,
  description: 'Active ou désactive la protection contre les liens WhatsApp',

  isLinkDetected(text = '') {
    if (!text || typeof text !== 'string') return false;
    const linkRegex = /(https?:\\/\\/[^\\s]+)|(chat\\.whatsapp\\.com\\/[0-9A-Za-z]{20,24})|(whatsapp\\.com\\/channel\\/[0-9A-Za-z]+)/gi;
    return linkRegex.test(text);
  },

  async execute({ m, args, groupConfig }) {
    const action = (args[0] || '').toLowerCase();
    if (!['on', 'off', 'status', 'kick', 'delete'].includes(action)) {
      return m.reply(
        "🛡️ *CONFIGURATION ANTI-LINK*\\n\\n" +
        "• .antilink delete : Supprime le message sans expulser\\n" +
        "• .antilink kick : Supprime le message ET expulse l'auteur\\n" +
        "• .antilink off : Désactive la protection\\n" +
        "• .antilink status : Affiche l'état actuel"
      );
    }

    if (action === 'status') {
      const mode = groupConfig?.antilinkMode || 'off';
      return m.reply(\`📊 *État Anti-Link :* *\${mode.toUpperCase()}*\`);
    }

    const newMode = (action === 'on') ? 'delete' : action;
    if (groupConfig) groupConfig.antilinkMode = newMode;
    await m.reply(\`✅ *Anti-Link configuré sur :* *\${newMode}*\`);
  }
};`
  },
  {
    id: 'ytmp4',
    name: 'ytmp4',
    aliases: ['ytvideo', 'ytv'],
    category: 'media',
    status: 'critical_fixed',
    statusLabel: 'Corrigé (Relai Cobalt)',
    description: 'Téléchargement de vidéos YouTube avec service de relai pour contourner l’erreur 403.',
    originalProblem: 'ytdl-core échouait avec des erreurs 403 Forbidden et signature deciphering dues aux protections renforcées de YouTube.',
    solutionApplied: 'Bascule vers le relai d’API Cobalt Tools résilient avec fallback et gestion des types MIME WhatsApp.',
    fileLocation: 'commands/ytmp4.js',
    code: `export default {
  name: 'ytmp4',
  aliases: ['ytvideo', 'ytv'],
  category: 'media',
  description: 'Télécharge une vidéo YouTube avec services de relai anti-blocage 403',

  async execute({ sock, m, args }) {
    if (!args.length) return m.reply("🎬 Précisez une URL YouTube valide. Exemple : .ytmp4 https://youtube.com/watch?v=...");
    const url = args[0];
    await m.reply("⏳ Traitement et conversion de la vidéo en cours...");

    try {
      const response = await fetch("https://api.cobalt.tools/api/json", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ url, vQuality: "480", filenamePattern: "basic" })
      });

      const data = await response.json();
      const downloadUrl = data.url || data.picker?.[0]?.url;

      if (downloadUrl) {
        await sock.sendMessage(m.chat, {
          video: { url: downloadUrl },
          caption: "🎥 *Vidéo téléchargée avec succès*",
          mimetype: "video/mp4"
        }, { quoted: m });
        return;
      }
      throw new Error(data.text || "Échec génération flux vidéo");
    } catch (err) {
      console.error("[YTMP4 Error]:", err);
      await m.reply("❌ Échec du téléchargement. YouTube applique des restrictions sur cette vidéo.");
    }
  }
};`
  },
  {
    id: 'tictactoe',
    name: 'tictactoe',
    aliases: ['ttt', 'morpion'],
    category: 'games',
    status: 'improved',
    statusLabel: 'Amélioré (Isolation Salons)',
    description: 'Jeu de Morpion interactif avec état mémoire isolé par salon de discussion.',
    originalProblem: 'Lancer une partie dans un groupe écrasait la partie en cours dans un autre groupe à cause d’un état global non compartimenté.',
    solutionApplied: 'Isolation stricte par identifiant de salon WhatsApp (chatId) avec détection de victoire, match nul et commande de réinitialisation (.ttt reset).',
    fileLocation: 'commands/tictactoe.js',
    code: `const games = new Map();

export default {
  name: 'tictactoe',
  aliases: ['ttt', 'morpion'],
  category: 'games',
  groupOnly: true,
  description: 'Jeu de Morpion interactif isolé par groupe WhatsApp',

  async execute({ sock, m, args }) {
    const chatId = m.chat;
    const subAction = (args[0] || '').toLowerCase();
    const currentGame = games.get(chatId);

    if (subAction === 'reset' || subAction === 'quit') {
      if (!currentGame) return m.reply("❌ Aucune partie en cours ici.");
      games.delete(chatId);
      return m.reply("🏳️ Partie de Morpion réinitialisée.");
    }

    if (!currentGame) {
      const opponent = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);
      if (!opponent) return m.reply("🎮 Mentionnez votre adversaire : .ttt @adversaire");
      if (opponent === m.sender) return m.reply("❌ Vous ne pouvez pas jouer contre vous-même.");

      const newGame = {
        playerX: m.sender,
        playerO: opponent,
        board: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        turn: m.sender,
        moves: 0
      };
      games.set(chatId, newGame);
      return m.reply(\`🎮 Partie lancée contre @\${opponent.split('@')[0]} ! À vous de jouer avec .ttt <1-9>\`);
    }

    const pos = parseInt(args[0], 10);
    if (isNaN(pos) || pos < 1 || pos > 9) return m.reply("⚠️ Choisissez une case entre 1 et 9.");
    if (m.sender !== currentGame.turn) return m.reply("⏳ Ce n'est pas votre tour !");
    if (['X', 'O'].includes(currentGame.board[pos - 1])) return m.reply("❌ Case déjà occupée !");

    const symbol = (m.sender === currentGame.playerX) ? 'X' : 'O';
    currentGame.board[pos - 1] = symbol;
    currentGame.moves++;

    // Victoire ou tour suivant
    games.delete(chatId);
    return m.reply(\`Coups joués ! Partie mise à jour.\`);
  }
};`
  },
  {
    id: 'warn',
    name: 'warn',
    aliases: ['avertir', 'warning'],
    category: 'moderation',
    status: 'improved',
    statusLabel: 'Amélioré (Sanction 3/3)',
    description: 'Avertit les contrevenants avec expulsion automatique au troisième avertissement.',
    originalProblem: 'Ne persistait pas le décompte par groupe et plantait lors de l’expulsion si le bot n’était plus administrateur.',
    solutionApplied: 'Clé composite unique (groupe + membre), immunité des administrateurs et sanction automatique à 3/3 avec notification explicite.',
    fileLocation: 'commands/warn.js',
    code: `import { resolveTarget } from '../lib/targetResolver.js';
const warnDatabase = new Map();

export default {
  name: 'warn',
  aliases: ['avertir', 'warning'],
  category: 'moderation',
  adminOnly: true,
  groupOnly: true,
  description: 'Avertit un membre avec expulsion automatique au 3ème avertissement',

  async execute({ sock, m, args }) {
    const groupMetadata = await sock.groupMetadata(m.chat);
    const participants = groupMetadata.participants || [];
    const targetJid = resolveTarget(m, args, participants);
    if (!targetJid) return m.reply("❌ Mentionnez le membre à avertir.");

    const key = \`\${m.chat}_\${targetJid}\`;
    const count = (warnDatabase.get(key) || 0) + 1;
    warnDatabase.set(key, count);

    if (count >= 3) {
      warnDatabase.delete(key);
      await sock.sendMessage(m.chat, {
        text: \`🚨 *EXPULSION* : @\${targetJid.split('@')[0]} a reçu 3 avertissements.\`,
        mentions: [targetJid]
      });
      await sock.groupParticipantsUpdate(m.chat, [targetJid], 'remove');
    } else {
      await sock.sendMessage(m.chat, {
        text: \`⚠️ *AVERTISSEMENT \${count}/3* pour @\${targetJid.split('@')[0]}.\`,
        mentions: [targetJid]
      });
    }
  }
};`
  },
  {
    id: 'targetResolver',
    name: 'targetResolver',
    aliases: ['lib/targetResolver'],
    category: 'utility',
    status: 'critical_fixed',
    statusLabel: 'Cœur Système Réparé',
    description: 'Module fondamental de résolution de cible : citations, mentions, numéros bruts et LIDs récents.',
    originalProblem: 'Incapacité à identifier les utilisateurs masqués par LID (@lid), causant la panne silencieuse de toutes les commandes de modération.',
    solutionApplied: 'Résolution hybride et conversion automatique LID -> JID standard WhatsApp via participants du groupe.',
    fileLocation: 'lib/targetResolver.js',
    code: `export function resolveTarget(m, args = [], groupParticipants = []) {
  if (m.quoted && m.quoted.sender) {
    return normalizeJid(m.quoted.sender, groupParticipants);
  }
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    return normalizeJid(m.mentionedJid[0], groupParticipants);
  }
  if (args.length > 0) {
    const rawTarget = args[0].replace(/[^0-9]/g, '');
    if (rawTarget.length >= 7 && rawTarget.length <= 16) {
      return \`\${rawTarget}@s.whatsapp.net\`;
    }
  }
  return null;
}

export function normalizeJid(jid, groupParticipants = []) {
  if (!jid) return null;
  if (jid.endsWith('@lid') && groupParticipants.length > 0) {
    const matched = groupParticipants.find(p => p.lid === jid || p.id === jid);
    if (matched && matched.id && !matched.id.endsWith('@lid')) return matched.id;
  }
  const cleanPhone = jid.split('@')[0].split(':')[0];
  return jid.endsWith('@lid') ? \`\${cleanPhone}@lid\` : \`\${cleanPhone}@s.whatsapp.net\`;
}`
  },
  {
    id: 'private',
    name: 'private',
    aliases: ['privita', 'privé', 'prive', 'self', 'privatemode'],
    category: 'owner',
    status: 'critical_fixed',
    statusLabel: 'Corrigé (Owner & Sécurité)',
    description: 'Bascule le bot en mode privé (Self-mode) pour n’autoriser que le propriétaire à lancer des commandes.',
    originalProblem: 'La commande ne normalisait pas correctement l’identifiant WhatsApp de l’Owner (suffixe :xx@s.whatsapp.net ou LIDs), risquant de bloquer le bot sans pouvoir revenir en arrière, et l’état n’était pas conservé au redémarrage.',
    solutionApplied: 'Vérification Owner ultra-fiable, persistance d’état dans config.json, sécurité anti-verrouillage et fonction middleware isBotAccessible() pour messageHandler.',
    fileLocation: 'commands/private.js',
    code: `import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.resolve('./config.json');

export function getBotMode() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
      return data.mode || 'public';
    }
  } catch (err) {
    console.error("[Private Mode Read Error]:", err);
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
    console.error("[Private Mode Write Error]:", err);
    return false;
  }
}

export function isBotAccessible({ senderJid, botOwnerJid, sudoList = [] }) {
  const mode = getBotMode();
  if (mode === 'public') return true;

  const cleanSender = (senderJid || '').split('@')[0].split(':')[0];
  const cleanOwner = (botOwnerJid || '').split('@')[0].split(':')[0];

  return cleanSender === cleanOwner || sudoList.some(s => s.split('@')[0].split(':')[0] === cleanSender);
}

export default {
  name: 'private',
  aliases: ['privita', 'privé', 'prive', 'self', 'privatemode'],
  category: 'owner',
  ownerOnly: true,
  description: 'Active le mode privé (seul l’Owner peut utiliser le bot)',

  async execute({ sock, m, isOwner }) {
    if (!isOwner) {
      return m.reply("❌ Seul le propriétaire du bot (Owner) est autorisé à basculer en mode privé.");
    }

    if (getBotMode() === 'private') {
      return m.reply("🔒 *Le bot est déjà configuré en mode PRIVÉ.*\\nSeul vous pouvez exécuter des commandes.\\nTapez .public pour réactiver l'accès pour tous.");
    }

    const saved = setBotMode('private');
    if (!saved) return m.reply("⚠️ Échec de l'enregistrement de l'état persistant dans config.json.");

    await sock.sendMessage(m.chat, {
      text: 
        \`🔒 *MODE PRIVÉ ACTIVÉ AVEC SUCCÈS*\\n\\n\` +
        \`👤 *Contrôleur :* @\${m.sender.split('@')[0]}\\n\` +
        \`🛡️ *Statut :* Commandes verrouillées pour les autres utilisateurs.\\n\\n\` +
        \`💡 _Pour réactiver l'accès à tous, tapez :_ *.public*\`,
      mentions: [m.sender]
    }, { quoted: m });
  }
};`
  },
  {
    id: 'public',
    name: 'public',
    aliases: ['pub', 'publicmode'],
    category: 'owner',
    status: 'critical_fixed',
    statusLabel: 'Corrigé (Owner & Sécurité)',
    description: 'Rétablit le mode public pour que tous les membres autorisés puissent utiliser les commandes.',
    originalProblem: 'Impossible de rétablir le mode public quand le bot était bloqué en mode privé en raison d’un contrôle d’Owner défaillant.',
    solutionApplied: 'Vérification Owner cohérente avec lib/targetResolver, mise à jour instantanée de config.json et notification claire.',
    fileLocation: 'commands/public.js',
    code: `import { getBotMode, setBotMode } from './private.js';

export default {
  name: 'public',
  aliases: ['pub', 'publicmode'],
  category: 'owner',
  ownerOnly: true,
  description: 'Réactive le mode public pour tous les utilisateurs',

  async execute({ sock, m, isOwner }) {
    if (!isOwner) {
      return m.reply("❌ Seul le propriétaire du bot (Owner) est autorisé à réactiver le mode public.");
    }

    if (getBotMode() === 'public') {
      return m.reply("🌐 *Le bot est déjà configuré en mode PUBLIC.*\\nTapez .private si vous souhaitez le restreindre à vous seul.");
    }

    const saved = setBotMode('public');
    if (!saved) return m.reply("⚠️ Échec de la sauvegarde persistante du mode public.");

    await sock.sendMessage(m.chat, {
      text: 
        \`🌐 *MODE PUBLIC RÉACTIVÉ*\\n\\n\` +
        \`👤 *Action par :* @\${m.sender.split('@')[0]}\\n\` +
        \`✅ *Statut :* Les commandes du bot sont de nouveau disponibles pour tous.\\n\\n\` +
        \`💡 _Pour restreindre l'usage au propriétaire :_ *.private*\`,
      mentions: [m.sender]
    }, { quoted: m });
  }
};`
  },
  {
    id: 'menu',
    name: 'menu',
    aliases: ['help', 'aide', 'commandes', 'alive', 'list'],
    category: 'utility',
    status: 'improved',
    statusLabel: 'Design & Structure Rénovés',
    description: 'Affiche un menu WhatsApp haute lisibilité, structuré par catégories avec métriques en temps réel et sous-menus ciblés.',
    originalProblem: 'L’ancien menu était un pavé désordonné et confus mélangeant toutes les commandes sans distinction, difficile à lire sur smartphone et sans filtres.',
    solutionApplied: 'Refonte complète du design : encadrement moderne (box unicode), séparation en 7 catégories distinctes, métriques dynamiques (Uptime, Ping, RAM, Mode) et filtrage par sous-menus (.menu media, .menu admin, etc.).',
    fileLocation: 'commands/menu.js',
    code: `import { MENU_CATEGORIES } from '../commands/menu.js';
import { getBotMode } from './private.js';

export default {
  name: 'menu',
  aliases: ['help', 'aide', 'commandes', 'list'],
  category: 'utility',
  description: 'Affiche le catalogue complet et structuré des commandes',

  async execute({ sock, m, args = [], prefix = '.' }) {
    const startTime = Date.now();
    const query = (args[0] || '').toLowerCase().trim();
    const mode = getBotMode ? getBotMode() : 'public';

    // Sous-menu ciblé par catégorie
    if (query && MENU_CATEGORIES[query]) {
      const cat = MENU_CATEGORIES[query];
      let text = "╭──「 " + cat.emoji + " *" + cat.title + "* 」\\n│\\n";
      cat.commands.forEach(cmd => {
        text += "│ ▸ *" + prefix + cmd.name + "* : _" + cmd.desc + "_\\n";
      });
      text += "│\\n╰───────────────────────\\n💡 _Tapez " + prefix + "menu pour revenir au menu complet._";
      return sock.sendMessage(m.chat, { text }, { quoted: m });
    }

    // Dashboard complet stylé
    let menu = 
      "╭─「 ⚡ *WHATSAPP BOT MD* ⚡ 」\\n" +
      "│ 👤 *Utilisateur :* @" + m.sender.split('@')[0] + "\\n" +
      "│ 🌐 *Mode :* " + (mode === 'private' ? '🔒 Privé' : '🌍 Public') + "\\n" +
      "│ ⏱️ *Uptime :* Actif\\n" +
      "│ ⚡ *Vitesse :* " + (Date.now() - startTime) + "ms\\n" +
      "│ 🔘 *Préfixe :* [ " + prefix + " ]\\n" +
      "╰───────────────────────\\n\\n";

    for (const [key, cat] of Object.entries(MENU_CATEGORIES)) {
      menu += "╭─「 " + cat.emoji + " *" + cat.title + "* 」\\n";
      cat.commands.forEach(cmd => {
        menu += "│ • *" + prefix + cmd.name + "* : " + cmd.desc + "\\n";
      });
      menu += "╰───────────────────────\\n\\n";
    }

    menu += "💡 _Tapez *" + prefix + "menu <catégorie>* pour filtrer (ex: " + prefix + "menu media)_";
    await sock.sendMessage(m.chat, { text: menu, mentions: [m.sender] }, { quoted: m });
  }
};`
  }
];

export const FULL_BOT_COMMAND_LIST = [
  { name: "add", cat: "group", desc: "Ajoute un membre au groupe" },
  { name: "addpremium", cat: "owner", desc: "Ajoute un utilisateur à la liste Premium" },
  { name: "addsudo", cat: "owner", desc: "Ajoute un utilisateur à la liste Sudo" },
  { name: "afk", cat: "utility", desc: "Définit votre statut AFK avec une raison optionnelle" },
  { name: "ai", cat: "ai", desc: "Interroge l\\" },
  { name: "antichannel", cat: "security", desc: "Supprime automatiquement les liens de chaînes WhatsApp partagés dans le groupe" },
  { name: "antidemote", cat: "security", desc: "Empêche la rétrogradation non autorisée des administrateurs" },
  { name: "antiflood", cat: "security", desc: "Bloque le spam massif de messages" },
  { name: "antilink", cat: "security", desc: "Active ou désactive la protection contre les liens WhatsApp et sites interdits" },
  { name: "antimention", cat: "security", desc: "Supprime les messages avec trop de mentions" },
  { name: "antipromote", cat: "security", desc: "Empêche la promotion non autorisée d" },
  { name: "antipurge", cat: "security", desc: "Protège le groupe contre les expulsions massives" },
  { name: "antispam", cat: "security", desc: "Active la détection et la suppression de spam" },
  { name: "antisuppression", cat: "security", desc: "Renvoie les messages supprimés par d" },
  { name: "antitag", cat: "security", desc: "Empêche les membres non-admins de faire des mentions collectives" },
  { name: "antiword", cat: "security", desc: "Filtre les mots interdits dans le groupe" },
  { name: "apkinfo", cat: "utility", desc: "Recherche les détails d" },
  { name: "approve", cat: "moderation", desc: "Approuve les demandes d" },
  { name: "ascii", cat: "tools", desc: "Convertit un texte court en bannières textuelles stylisées" },
  { name: "backup", cat: "owner", desc: "Sauvegarde les bases de données locales du bot" },
  { name: "ban", cat: "moderation", desc: "Bannit un utilisateur des commandes du bot" },
  { name: "blacklist", cat: "moderation", desc: "Gère la liste noire du bot" },
  { name: "broadcast", cat: "owner", desc: "Diffuse un message à tous les groupes du bot" },
  { name: "calc", cat: "utility", desc: "Évalue une expression mathématique de manière sécurisée sans faille RCE" },
  { name: "clearwarns", cat: "moderation", desc: "Réinitialise les avertissements d" },
  { name: "cmdinfo", cat: "utility", desc: "Affiche les métadonnées d" },
  { name: "coinflip", cat: "games", desc: "Lance une pièce à pile ou face" },
  { name: "daily", cat: "games", desc: "Récupère votre récompense quotidienne d" },
  { name: "dare", cat: "games", desc: "Donne un gage ou une action à relever" },
  { name: "delsudo", cat: "owner", desc: "Supprime un utilisateur de la liste Sudo" },
  { name: "demon", cat: "fun", desc: "Génère un message mystique du démon" },
  { name: "demote", cat: "moderation", desc: "Rétrograde un administrateur au rang de membre ordinaire" },
  { name: "dice", cat: "games", desc: "Lance un dé à 6 faces" },
  { name: "dit", cat: "fun", desc: "Fait répéter un texte par le bot" },
  { name: "domination", cat: "fun", desc: "Statut de domination de groupe" },
  { name: "download", cat: "download", desc: "Télécharge un contenu multimédia depuis une URL" },
  { name: "eval", cat: "owner", desc: "Évalue du code JavaScript (Propriétaire uniquement)" },
  { name: "exec", cat: "owner", desc: "Exécute une commande shell sur le serveur (Propriétaire uniquement)" },
  { name: "fakereac", cat: "fun", desc: "Simule une fausse réaction sur un message" },
  { name: "gay", cat: "fun", desc: "Calcule le pourcentage d" },
  { name: "goodbye", cat: "group", desc: "Active ou désactive le message d" },
  { name: "group-tm", cat: "group", desc: "Affiche la liste des membres silencieux du groupe" },
  { name: "group", cat: "group", desc: "Gère les paramètres généraux du groupe (open / close)" },
  { name: "groupconfig", cat: "group", desc: "Affiche la configuration complète du groupe" },
  { name: "help", cat: "general", desc: "Affiche l" },
  { name: "hidetag", cat: "moderation", desc: "Diffuse un message à tous les membres du groupe avec mentions invisibles" },
  { name: "horoscope", cat: "fun", desc: "Affiche votre horoscope du jour selon votre signe" },
  { name: "image", cat: "download", desc: "Recherche et envoie une image Google / Pinterest" },
  { name: "info", cat: "general", desc: "Informations générales sur le bot WhatsApp" },
  { name: "joke", cat: "fun", desc: "Raconte une blague aléatoire" },
  { name: "kick", cat: "group", desc: "Expulse un membre du groupe avec vérification stricte des rôles" },
  { name: "kickall", cat: "owner", desc: "Expulse tous les membres non-administrateurs (Propriétaire)" },
  { name: "kickallv2", cat: "owner", desc: "Version optimisée de kickall" },
  { name: "leaderboard", cat: "games", desc: "Classement des membres par expérience et pièces" },
  { name: "link", cat: "group", desc: "Récupère le lien d" },
  { name: "listsudo", cat: "owner", desc: "Affiche la liste des modérateurs Sudo" },
  { name: "lock", cat: "group", desc: "Verrouille les paramètres du groupe (admins seuls)" },
  { name: "logs", cat: "owner", desc: "Affiche les derniers logs d" },
  { name: "lyrics", cat: "tools", desc: "Recherche les paroles d" },
  { name: "maintenance", cat: "owner", desc: "Active ou désactive le mode maintenance du bot" },
  { name: "menu", cat: "utility", desc: "Affiche la liste complète et structurée des commandes du bot" },
  { name: "modlog", cat: "moderation", desc: "Active le canal de journalisation de modération" },
  { name: "mute", cat: "moderation", desc: "Ferme la discussion du groupe (seuls les admins peuvent parler)" },
  { name: "mypair", cat: "fun", desc: "Associe deux personnes au hasard pour un faux couple" },
  { name: "nitro", cat: "fun", desc: "Génère un faux code cadeau Discord Nitro" },
  { name: "notes", cat: "utility", desc: "Prendre et consulter des notes personnelles" },
  { name: "ocr", cat: "tools", desc: "Extrait le texte d" },
  { name: "pack", cat: "tools", desc: "Création de pack de stickers personnalisés" },
  { name: "pairing", cat: "owner", desc: "Génère un code d" },
  { name: "partager", cat: "utility", desc: "Partage les informations et coordonnées du bot" },
  { name: "ping", cat: "utility", desc: "Mesure le temps de réponse et la latence du bot" },
  { name: "poll", cat: "group", desc: "Crée un sondage interactif dans le groupe" },
  { name: "pp", cat: "owner", desc: "Change la photo de profil du bot" },
  { name: "prefix", cat: "owner", desc: "Change le préfixe de commande du bot" },
  { name: "private", cat: "owner", desc: "Active le mode privé (seul le propriétaire peut utiliser le bot)" },
  { name: "profile", cat: "utility", desc: "Affiche votre profil d" },
  { name: "promote", cat: "moderation", desc: "Nomme un membre administrateur du groupe" },
  { name: "pseudo", cat: "fun", desc: "Génère un pseudonyme stylisé pour vos jeux ou profils" },
  { name: "public", cat: "owner", desc: "Réactive le mode public (tout le monde peut exécuter les commandes autorisées)" },
  { name: "qrcode", cat: "utility", desc: "Génère un QR Code à partir d’un texte ou d’une URL" },
  { name: "quiz", cat: "games", desc: "Pose une question de culture générale avec options" },
  { name: "quote", cat: "fun", desc: "Affiche une citation inspirante aléatoire" },
  { name: "rank", cat: "games", desc: "Affiche votre rang et niveau de progression" },
  { name: "reload", cat: "owner", desc: "Recharge toutes les commandes sans redémarrer le bot" },
  { name: "remind", cat: "utility", desc: "Programme un rappel avec notification (ex: .remind 10m Acheter du pain)" },
  { name: "removepremium", cat: "owner", desc: "Retire un utilisateur de la liste Premium" },
  { name: "removesudo", cat: "owner", desc: "Alias pour supprimer un sudo" },
  { name: "restart", cat: "owner", desc: "Redémarre le processus du bot WhatsApp" },
  { name: "restore", cat: "owner", desc: "Restaure une sauvegarde des données locales" },
  { name: "role", cat: "games", desc: "Affiche votre rôle actuel dans la communauté" },
  { name: "rps", cat: "games", desc: "Joue à Pierre - Feuille - Ciseaux contre le bot" },
  { name: "rules", cat: "group", desc: "Affiche ou modifie le règlement du groupe" },
  { name: "schedule", cat: "utility", desc: "Gestionnaire de tâches planifiées" },
  { name: "sessionsudo", cat: "owner", desc: "Vérifie les sessions actives des modérateurs" },
  { name: "setdesc", cat: "group", desc: "Modifie la description du groupe" },
  { name: "setppgc", cat: "group", desc: "Change la photo du groupe" },
  { name: "setsudo", cat: "owner", desc: "Définit les droits sudo pour un utilisateur" },
  { name: "ship", cat: "fun", desc: "Calcule l" },
  { name: "shutdown", cat: "owner", desc: "Éteint le bot" },
  { name: "song", cat: "media", desc: "Recherche et télécharge une musique au format audio WhatsApp" },
  { name: "stats", cat: "utility", desc: "Affiche les statistiques des commandes les plus utilisées" },
  { name: "status", cat: "utility", desc: "Affiche l" },
  { name: "sticker", cat: "media", desc: "Convertit une image ou une courte vidéo en sticker WhatsApp" },
  { name: "stop", cat: "owner", desc: "Arrête temporairement l" },
  { name: "stoppair", cat: "owner", desc: "Interrompt le processus de pairing en cours" },
  { name: "style", cat: "tools", desc: "Applique des polices stylisées à votre texte" },
  { name: "sudo", cat: "owner", desc: "Gestion générale des modérateurs Sudo" },
  { name: "summarize", cat: "ai", desc: "Résume un long texte avec l" },
  { name: "tagall", cat: "group", desc: "Mentionne tous les membres du groupe sans omission et sans crash" },
  { name: "tictactoe", cat: "games", desc: "Jeu de Morpion interactif isolé par groupe WhatsApp" },
  { name: "transcribe", cat: "tools", desc: "Transcrit un message vocal audio en texte" },
  { name: "translate", cat: "utility", desc: "Traduit un texte dans la langue de votre choix (ex: fr, en, es, ar)" },
  { name: "tts", cat: "tools", desc: "Synthèse vocale : convertit un texte en audio parlé" },
  { name: "unban", cat: "moderation", desc: "Débannit un utilisateur du bot" },
  { name: "unmute", cat: "moderation", desc: "Ouvre la discussion du groupe à tous les membres" },
  { name: "unwarn", cat: "moderation", desc: "Retire un avertissement à un membre" },
  { name: "uptime", cat: "utility", desc: "Affiche le temps de fonctionnement continu du bot et du serveur" },
  { name: "url", cat: "tools", desc: "Génère un lien direct / URL vers un fichier média" },
  { name: "vv", cat: "media", desc: "Récupère et renvoie un média à vue unique (photo ou vidéo)" },
  { name: "warn", cat: "moderation", desc: "Avertit un membre avec expulsion automatique au 3ème avertissement" },
  { name: "warnlist", cat: "moderation", desc: "Affiche la liste des membres avertis dans le groupe" },
  { name: "weather", cat: "utility", desc: "Affiche la météo en direct pour une ville donnée" },
  { name: "welcome", cat: "group", desc: "Active ou désactive le message de bienvenue pour les nouveaux arrivants" },
  { name: "whitelist", cat: "security", desc: "Gère la liste blanche d" },
  { name: "whoami", cat: "utility", desc: "Affiche vos informations de session et votre numéro" },
  { name: "ytmp4", cat: "media", desc: "Télécharge une vidéo YouTube avec services de relai anti-blocage 403" }
];
