import path from 'path';
import { readJson, writeJson } from './safeStore.js';

const DB_PATH = path.resolve('./data/owners.json');

export function getSudoList(defaultList = []) {
  const data = readJson(DB_PATH, { sudo: defaultList });
  return Array.isArray(data.sudo) ? data.sudo : [];
}

export function addSudo(number) {
  const data = readJson(DB_PATH, { sudo: [] });
  const clean = number.replace(/[^0-9]/g, '');
  if (!data.sudo.includes(clean)) {
    data.sudo.push(clean);
    writeJson(DB_PATH, data);
  }
  return data.sudo;
}

export function removeSudo(number) {
  const data = readJson(DB_PATH, { sudo: [] });
  const clean = number.replace(/[^0-9]/g, '');
  data.sudo = data.sudo.filter(n => n !== clean);
  writeJson(DB_PATH, data);
  return data.sudo;
}

export function isUserOwnerOrSudo(senderNumber, ownerNumber, sudoList = []) {
  const cleanSender = senderNumber.replace(/[^0-9]/g, '');
  const cleanOwner = (ownerNumber || '').replace(/[^0-9]/g, '');
  if (cleanSender === cleanOwner) return true;
  const currentSudo = getSudoList(sudoList);
  return currentSudo.includes(cleanSender);
}
