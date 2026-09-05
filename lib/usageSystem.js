import path from 'path';
import { readJson, writeJson } from './safeStore.js';

const DB_PATH = path.resolve('./data/userEconomy.json');

export function getUserData(userJid) {
  const db = readJson(DB_PATH, {});
  return db[userJid] || { exp: 0, coins: 50, rank: 'Bronze', dailyClaimed: null };
}

export function addExperience(userJid, amount = 10) {
  const db = readJson(DB_PATH, {});
  const current = db[userJid] || { exp: 0, coins: 50, rank: 'Bronze', dailyClaimed: null };
  current.exp += amount;
  if (current.exp > 1000) current.rank = 'Diamant';
  else if (current.exp > 500) current.rank = 'Or';
  else if (current.exp > 200) current.rank = 'Argent';
  db[userJid] = current;
  writeJson(DB_PATH, db);
  return current;
}
