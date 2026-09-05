import path from 'path';
import { readJson, writeJson } from './safeStore.js';

const DB_PATH = path.resolve('./data/antimention.json');

export function isAntiMentionActive(chatJid) {
  const db = readJson(DB_PATH, {});
  return !!db[chatJid];
}

export function setAntiMention(chatJid, enable = true) {
  const db = readJson(DB_PATH, {});
  if (enable) db[chatJid] = true;
  else delete db[chatJid];
  writeJson(DB_PATH, db);
}
