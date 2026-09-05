import { downloadMediaMessage } from '@whiskeysockets/baileys';

export async function downloadMedia(message, type = 'buffer') {
  try {
    return await downloadMediaMessage(
      message,
      type,
      {},
      { logger: console }
    );
  } catch (err) {
    console.error("[downloadMedia error]", err);
    return null;
  }
}
