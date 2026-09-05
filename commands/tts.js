export default {
  name: 'tts',
  aliases: ['voix'],
  category: 'tools',
  description: 'Synthèse vocale : convertit un texte en audio parlé',
  async execute({ sock, m, args }) {
    const text = args.join(' ');
    if (!text) return m.reply('❌ Précisez le texte à prononcer.');
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=fr&client=tw-ob&q=${encodeURIComponent(text)}`;
    await sock.sendMessage(m.chat, { audio: { url: ttsUrl }, mimetype: 'audio/mp4', ptt: true }, { quoted: m });
  }
};
