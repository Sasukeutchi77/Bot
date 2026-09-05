import axios from 'axios';

export default {
  name: 'translate',
  aliases: ['trad', 'tr'],
  category: 'utility',
  description: 'Traduit un texte dans la langue de votre choix (ex: fr, en, es, ar)',

  async execute({ m, args, quoted }) {
    const lang = (args[0] && args[0].length <= 3) ? args[0].toLowerCase() : 'fr';
    const textToTranslate = (args[0] && args[0].length <= 3 ? args.slice(1).join(' ') : args.join(' ')) ||
      quoted?.message?.conversation ||
      quoted?.message?.extendedTextMessage?.text;

    if (!textToTranslate) {
      return m.reply("❌ Précisez un texte à traduire ou répondez à un message.\n_Exemple :_ *.translate en Bonjour comment vas-tu ?*");
    }

    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=autodetect|${lang}`;
      const res = await axios.get(url, { timeout: 10000 });
      const translated = res.data?.responseData?.translatedText;

      if (translated) {
        await m.reply(`🌐 *Traduction (${lang.toUpperCase()}) :*\n\n${translated}`);
      } else {
        await m.reply("❌ Impossible de traduire ce message.");
      }
    } catch (err) {
      console.error("[Translate Error]:", err);
      await m.reply("❌ Erreur de connexion au service de traduction.");
    }
  }
};
