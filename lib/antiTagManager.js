import path from 'path';
import { readJson, writeJson } from './safeStore.js';

const DB_PATH = path.resolve('./data/antitag.json');

export function isAntiTagActive(chatJid) {
  const db = readJson(DB_PATH, {});
  return !!db[chatJid];
}

export function setAntiTag(chatJid, enable = true) {
  const db = readJson(DB_PATH, {});
  if (enable) db[chatJid] = true;
  else delete db[chatJid];
  writeJson(DB_PATH, db);
}
