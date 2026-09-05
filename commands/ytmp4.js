export default {
  name: 'ytmp4',
  aliases: ['ytvideo', 'ytv'],
  category: 'media',
  description: 'Télécharge une vidéo YouTube avec services de relai anti-blocage 403',

  async execute({ sock, m, args }) {
    if (!args.length) {
      return m.reply(
        "🎬 *Téléchargeur Vidéo YouTube*\n" +
        "Usage : `.ytmp4 <lien_youtube>`\n\n" +
        "📌 *Exemple :* `.ytmp4 https://www.youtube.com/watch?v=dQw4w9WgXcQ`"
      );
    }

    const url = args[0];
    const isYoutubeUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);

    if (!isYoutubeUrl) {
      return m.reply("❌ Veuillez fournir un lien YouTube valide (ex: youtube.com/watch?v=... ou youtu.be/...)");
    }

    await m.reply("⏳ Traitement et conversion de la vidéo en cours...");

    try {
      // Utilisation d'un proxy Cobalt API moderne et résilient (sans blocage cipher 403)
      const cobaltEndpoint = "https://api.cobalt.tools/api/json";
      const response = await fetch(cobaltEndpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "User-Agent": "WhatsAppBot/2.0"
        },
        body: JSON.stringify({
          url: url,
          vQuality: "480",
          filenamePattern: "basic"
        })
      });

      const data = await response.json();

      if (data.status === 'stream' || data.status === 'picker' || data.url) {
        const downloadUrl = data.url || data.picker?.[0]?.url;

        if (downloadUrl) {
          await sock.sendMessage(m.chat, {
            video: { url: downloadUrl },
            caption: "🎥 *Vidéo téléchargée avec succès*",
            mimetype: "video/mp4"
          }, { quoted: m });
          return;
        }
      }

      throw new Error(data.text || "Impossible de générer le flux vidéo");

    } catch (err) {
      console.error("[YTMP4 Error]:", err);
      await m.reply(
        "❌ Échec du téléchargement direct.\n" +
        "💡 *Conseil :* YouTube applique des restrictions temporaires sur certaines vidéos sous copyright ou longues."
      );
    }
  }
};
