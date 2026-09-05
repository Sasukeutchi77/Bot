import path from 'path';
import { readJson, writeJson } from './safeStore.js';

const DB_PATH = path.resolve('./data/prefix.json');

export function getPrefix(chatJid, defaultPrefix = '.') {
  const db = readJson(DB_PATH, {});
  return db[chatJid] || defaultPrefix;
}

export function setPrefix(chatJid, prefix) {
  const db = readJson(DB_PATH, {});
  db[chatJid] = prefix;
  writeJson(DB_PATH, db);
  return prefix;
}
