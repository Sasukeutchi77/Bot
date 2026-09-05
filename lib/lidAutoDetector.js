const lidToPhoneMap = new Map();

export function registerLidMapping(lid, phoneJid) {
  if (lid && phoneJid) {
    lidToPhoneMap.set(lid, phoneJid);
  }
}

export function resolveLid(jid) {
  if (!jid) return jid;
  if (jid.endsWith('@lid')) {
    return lidToPhoneMap.get(jid) || jid;
  }
  return jid;
}
