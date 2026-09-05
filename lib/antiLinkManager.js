import path from 'path';
import { readJson, writeJson } from './safeStore.js';

const DB_PATH = path.resolve('./data/antilink.json');

export function getAntilinkSetting(chatJid) {
  const db = readJson(DB_PATH, {});
  return db[chatJid] || false; // false, 'delete', 'kick'
}

export function setAntilinkSetting(chatJid, mode) {
  const db = readJson(DB_PATH, {});
  if (!mode || mode === 'off') {
    delete db[chatJid];
  } else {
    db[chatJid] = mode;
  }
  writeJson(DB_PATH, db);
  return mode;
}

export function containsGroupLink(text = '') {
  const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
  return linkRegex.test(text);
}
