import path from 'path';
import { readJson, writeJson } from './safeStore.js';

const DB_PATH = path.resolve('./data/sessionMeta.json');

export function saveSessionMetadata(data) {
  writeJson(DB_PATH, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

export function getSessionMetadata() {
  return readJson(DB_PATH, {});
}
