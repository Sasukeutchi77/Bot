import { downloadMedia } from '../lib/media.js';

export default {
  name: 'pp',
  category: 'owner',
  description: "Change la photo de profil du bot",
  async execute({ sock, m, quoted, isOwner }) {
    if (!isOwner) return m.reply("❌ Réservé au propriétaire.");
    if (!quoted) return m.reply("❌ Répondez à une image.");
    const buf = await downloadMedia(quoted);
    if (!buf) return m.reply("❌ Impossible de lire l'image.");
    await sock.updateProfilePicture(sock.user.id, buf);
    await m.reply("✅ Photo de profil du bot mise à jour.");
  }
};
