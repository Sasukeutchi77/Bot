export default {
  name: 'fakereac',
  category: 'fun',
  description: 'Simule une fausse réaction sur un message',
  async execute({ sock, m, args, quoted }) {
    const emoji = args[0] || '❤️';
    const target = quoted || m;
    await sock.sendMessage(m.chat, { react: { text: emoji, key: target.key } });
  }
};
