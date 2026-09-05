import path from 'path';
import { readJson, writeJson } from './safeStore.js';

const DB_PATH = path.resolve('./data/auditLogs.json');

export function logAction(actionType, actorJid, targetJid, details = {}) {
  const logs = readJson(DB_PATH, []);
  const entry = {
    action: actionType,
    actor: actorJid,
    target: targetJid,
    details,
    timestamp: new Date().toISOString()
  };
  logs.unshift(entry);
  if (logs.length > 500) logs.pop();
  writeJson(DB_PATH, logs);
  return entry;
}

export function getAuditLogs(limit = 20) {
  const logs = readJson(DB_PATH, []);
  return logs.slice(0, limit);
}
