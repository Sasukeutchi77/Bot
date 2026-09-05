import { downloadMedia } from '../lib/media.js';

export default {
  name: 'setppgc',
  category: 'group',
  description: "Change la photo du groupe",
  async execute({ sock, m, quoted, isGroup, isBotAdmin, isSenderAdmin }) {
    if (!isGroup) return m.reply("❌ Commande de groupe.");
    if (!isSenderAdmin) return m.reply("❌ Vous devez être administrateur.");
    if (!isBotAdmin) return m.reply("❌ Le bot doit être administrateur.");
    if (!quoted) return m.reply("❌ Répondez à une image.");
    const buf = await downloadMedia(quoted);
    if (!buf) return m.reply("❌ Impossible de télécharger l'image.");
    await sock.updateProfilePicture(m.chat, buf);
    await m.reply("✅ Photo du groupe mise à jour.");
  }
};
