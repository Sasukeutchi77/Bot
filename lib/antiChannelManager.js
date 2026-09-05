import path from 'path';
import { readJson, writeJson } from './safeStore.js';

const DB_PATH = path.resolve('./data/antichannel.json');

export function isAntiChannelActive(chatJid) {
  const db = readJson(DB_PATH, {});
  return !!db[chatJid];
}

export function setAntiChannel(chatJid, enable = true) {
  const db = readJson(DB_PATH, {});
  if (enable) {
    db[chatJid] = true;
  } else {
    delete db[chatJid];
  }
  writeJson(DB_PATH, db);
  return !!db[chatJid];
}

export function containsChannelLink(text = '') {
  const regex = /whatsapp\.com\/channel\/[0-9A-Za-z]+/i;
  return regex.test(text);
}
