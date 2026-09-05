import axios from 'axios';

export default {
  name: 'song',
  aliases: ['play', 'music', 'musique'],
  category: 'media',
  description: 'Recherche et télécharge une musique au format audio WhatsApp',

  async execute({ sock, m, args }) {
    const query = args.join(' ').trim();
    if (!query) {
      return m.reply("❌ Veuillez spécifier le nom d'un morceau ou d'un artiste.\n_Exemple :_ *.song Stromae Formidable*");
    }

    await m.reply(`🎵 Recherche et conversion de *${query}* en cours...`);

    try {
      // API de téléchargement audio YouTube / SoundCloud
      const searchUrl = `https://api.agatz.xyz/api/ytmp3?url=${encodeURIComponent(query)}`;
      const res = await axios.get(searchUrl, { timeout: 25000 });

      if (res.data?.data?.downloadUrl) {
        const { title, downloadUrl, author } = res.data.data;
        await sock.sendMessage(m.chat, {
          audio: { url: downloadUrl },
          mimetype: 'audio/mp4',
          ptt: false,
          fileName: `${title || 'musique'}.mp3`
        }, { quoted: m });
      } else {
        await m.reply(`⚠️ Impossible de récupérer la piste audio pour "${query}". Réessayez avec un titre plus précis.`);
      }
    } catch (err) {
      console.error("[Song Error]:", err);
      await m.reply("❌ Erreur lors du téléchargement du fichier audio.");
    }
  }
};
