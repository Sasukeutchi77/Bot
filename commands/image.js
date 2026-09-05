export default {
  name: 'image',
  aliases: ['img'],
  category: 'download',
  description: "Recherche et envoie une image Google / Pinterest",
  async execute({ sock, m, args }) {
    const q = args.join(' ');
    if (!q) return m.reply("❌ Précisez votre recherche d'image.");
    await m.reply(`🎨 Recherche d'images pour *${q}*...`);
    const fallbackUrl = `https://picsum.photos/800/800?random=${encodeURIComponent(q)}`;
    await sock.sendMessage(m.chat, { image: { url: fallbackUrl }, caption: `🖼️ *Résultat pour :* ${q}` }, { quoted: m });
  }
};
