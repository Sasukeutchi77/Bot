import path from 'path';
import { readJson, writeJson } from './safeStore.js';

const DB_PATH = path.resolve('./data/groupConfig.json');

export function getGroupConfig(jid) {
  const all = readJson(DB_PATH, {});
  return all[jid] || {
    antilink: false,
    antichannel: false,
    antitag: false,
    antiraid: false,
    antiflood: false,
    welcome: true,
    goodbye: true,
    mute: false
  };
}

export function updateGroupConfig(jid, patch) {
  const all = readJson(DB_PATH, {});
  all[jid] = { ...getGroupConfig(jid), ...patch };
  writeJson(DB_PATH, all);
  return all[jid];
}
