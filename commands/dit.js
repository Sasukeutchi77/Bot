export default {
  name: 'dit',
  aliases: ['say'],
  category: 'fun',
  description: 'Fait répéter un texte par le bot',
  async execute({ sock, m, args }) {
    const txt = args.join(' ');
    if (!txt) return m.reply('❌ Précisez ce que le bot doit dire.');
    await sock.sendMessage(m.chat, { text: txt });
  }
};
