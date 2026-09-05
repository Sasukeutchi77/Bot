import axios from 'axios';

export default {
  name: 'weather',
  aliases: ['meteo', 'climat'],
  category: 'utility',
  description: 'Affiche la météo en direct pour une ville donnée',

  async execute({ m, args }) {
    const city = args.join(' ').trim();
    if (!city) {
      return m.reply("❌ Précisez le nom d'une ville.\n_Exemple :_ *.weather Paris* ou *.meteo Dakar*");
    }

    try {
      const res = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout: 10000 });
      const current = res.data.current_condition[0];
      const area = res.data.nearest_area[0];

      const text = 
        `╭─「 🌤️ *MÉTÉO EN DIRECT* 」\n` +
        `│\n` +
        `│ 📍 *Ville :* ${area.areaName[0].value}, ${area.country[0].value}\n` +
        `│ 🌡️ *Température :* ${current.temp_C}°C (Ressenti : ${current.FeelsLikeC}°C)\n` +
        `│ ☁️ *Conditions :* ${current.weatherDesc[0].value}\n` +
        `│ 💧 *Humidité :* ${current.humidity}%\n` +
        `│ 💨 *Vent :* ${current.windspeedKmph} km/h\n` +
        `│\n` +
        `╰────────────────────────`;

      await m.reply(text);
    } catch (err) {
      console.error("[Weather Error]:", err);
      await m.reply(`❌ Impossible de récupérer la météo pour "${city}".`);
    }
  }
};
