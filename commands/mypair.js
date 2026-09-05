export default {
  name: 'mypair',
  category: 'fun',
  description: 'Associe deux personnes au hasard pour un faux couple',
  async execute({ sock, m, isGroup }) {
    if (!isGroup) return m.reply('❌ Commande de groupe.');
    const meta = await sock.groupMetadata(m.chat);
    const users = meta.participants.map(p => p.id);
    if (users.length < 2) return m.reply('❌ Pas assez de membres.');
    const u1 = users[Math.floor(Math.random() * users.length)];
    let u2 = users[Math.floor(Math.random() * users.length)];
    while (u2 === u1 && users.length > 1) {
      u2 = users[Math.floor(Math.random() * users.length)];
    }
    await m.reply(`💖 *COUPLE DU JOUR :*\n\n@${u1.split('@')[0]} ❤️ @${u2.split('@')[0]}`, { mentions: [u1, u2] });
  }
};
