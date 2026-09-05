import axios from 'axios';

export default {
  name: 'apkinfo',
  category: 'utility',
  description: "Recherche les détails d'une application APK",
  async execute({ m, args }) {
    const q = args.join(' ');
    if (!q) return m.reply("❌ Spécifiez le nom d'une application.");
    await m.reply(`🔍 Recherche d'informations pour *${q}*...`);
    try {
      const res = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=software&limit=1`);
      if (res.data?.results?.[0]) {
        const app = res.data.results[0];
        return m.reply(`📱 *${app.trackName}*\n🏢 *Éditeur :* ${app.artistName}\n⭐ *Note :* ${app.averageUserRating || 'N/A'}\n📦 *Version :* ${app.version}\n🔗 *Lien :* ${app.trackViewUrl}`);
      }
      m.reply("❌ Aucune application trouvée.");
    } catch (e) {
      m.reply("❌ Erreur lors de la recherche.");
    }
  }
};
