import path from 'path';
import { readJson, writeJson } from './safeStore.js';

const DB_PATH = path.resolve('./data/commandStats.json');

export function incrementCommandUsage(commandName) {
  const stats = readJson(DB_PATH, {});
  stats[commandName] = (stats[commandName] || 0) + 1;
  writeJson(DB_PATH, stats);
}

export function getTopCommands(limit = 10) {
  const stats = readJson(DB_PATH, {});
  return Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}
