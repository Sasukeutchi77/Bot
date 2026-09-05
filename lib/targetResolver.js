/**
 * Target Resolver amélioré pour Baileys
 * Résout les cibles de manière universelle :
 * - Messages cités (quoted message)
 * - Mentions (@utilisateur)
 * - Numéro de téléphone direct en argument
 * - Prise en charge des LIDs WhatsApp récents (@lid) avec conversion en JID
 */

export function resolveTarget(m, args = [], groupParticipants = []) {
  // 1. Détection via message cité
  if (m.quoted && m.quoted.sender) {
    return normalizeJid(m.quoted.sender, groupParticipants);
  }

  // 2. Détection via mentions explicites dans le message
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    return normalizeJid(m.mentionedJid[0], groupParticipants);
  }

  // 3. Détection via argument texte (numéro de téléphone tapé)
  if (args.length > 0) {
    const rawTarget = args[0].replace(/[^0-9]/g, '');
    if (rawTarget.length >= 7 && rawTarget.length <= 16) {
      return `${rawTarget}@s.whatsapp.net`;
    }
  }

  return null;
}

/**
 * Normalise un JID ou un LID vers le JID standard WhatsApp (@s.whatsapp.net)
 */
export function normalizeJid(jid, groupParticipants = []) {
  if (!jid) return null;

  // Si c'est un LID, tenter de trouver le JID réel dans les participants du groupe
  if (jid.endsWith('@lid') && groupParticipants.length > 0) {
    const matched = groupParticipants.find(p => p.lid === jid || p.id === jid);
    if (matched && matched.id && !matched.id.endsWith('@lid')) {
      return matched.id;
    }
  }

  // Nettoyer les suffixes d'appareils (ex: 12345:0@s.whatsapp.net -> 12345@s.whatsapp.net)
  const [userPart] = jid.split('@');
  const cleanPhone = userPart.split(':')[0];
  
  if (jid.endsWith('@lid')) {
    return `${cleanPhone}@lid`;
  }
  
  return `${cleanPhone}@s.whatsapp.net`;
}
