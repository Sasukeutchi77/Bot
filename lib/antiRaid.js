const joinHistory = new Map();

export function checkRaidAttempt(groupJid, maxJoinsPerMinute = 8) {
  const now = Date.now();
  const timestamps = (joinHistory.get(groupJid) || []).filter(t => now - t < 60000);
  timestamps.push(now);
  joinHistory.set(groupJid, timestamps);

  return timestamps.length > maxJoinsPerMinute;
}

export function resetRaidTracker(groupJid) {
  joinHistory.delete(groupJid);
}
