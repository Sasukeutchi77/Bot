const userCooldowns = new Map();

export function isSpamming(userJid, limitMs = 1500) {
  const now = Date.now();
  const last = userCooldowns.get(userJid) || 0;
  if (now - last < limitMs) {
    return true;
  }
  userCooldowns.set(userJid, now);
  return false;
}
