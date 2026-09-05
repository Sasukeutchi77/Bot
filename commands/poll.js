export default {
  name: 'poll',
  aliases: ['sondage'],
  category: 'group',
  description: 'Crée un sondage interactif dans le groupe',
  async execute({ sock, m, args, isGroup }) {
    if (!isGroup) return m.reply('❌ Commande de groupe.');
    const full = args.join(' ');
    const parts = full.split('|').map(s => s.trim()).filter(Boolean);
    if (parts.length < 3) return m.reply('❌ Format : *.poll Question | Option 1 | Option 2*');
    const [name, ...values] = parts;
    await sock.sendMessage(m.chat, {
      poll: {
        name,
        values,
        selectableCount: 1
      }
    });
  }
};
