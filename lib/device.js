import { getDevice } from '@whiskeysockets/baileys';

export function detectDevice(messageId = '') {
  try {
    return getDevice(messageId) || 'unknown';
  } catch (e) {
    return 'unknown';
  }
}
