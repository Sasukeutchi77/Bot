import axios from 'axios';

export default {
  name: 'lyrics',
  aliases: ['paroles'],
  category: 'tools',
  description: "Recherche les paroles d'une chanson",
  async execute({ m, args }) {
    const title = args.join(' ');
    if (!title) return m.reply("❌ Spécifiez le titre d'un morceau.");
    await m.reply(`🎵 Recherche des paroles pour *${title}*...`);
    try {
      const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(title)}/paroles`);
      if (res.data?.lyrics) {
        return m.reply(`📜 *PAROLES :*\n\n${res.data.lyrics.slice(0, 1500)}...`);
      }
      m.reply("❌ Paroles non trouvées.");
    } catch (e) {
      m.reply("❌ Impossible de trouver les paroles.");
    }
  }
};
