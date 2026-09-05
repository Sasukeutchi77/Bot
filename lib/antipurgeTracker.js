const purgeAttempts = new Map();

export function registerPurgeAction(adminJid) {
  const count = purgeAttempts.get(adminJid) || 0;
  purgeAttempts.set(adminJid, count + 1);
  return count + 1;
}

export function resetPurgeAction(adminJid) {
  purgeAttempts.delete(adminJid);
}
