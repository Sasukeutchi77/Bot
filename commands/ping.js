export default {
  name: 'ping',
  aliases: ['p', 'speed', 'latence'],
  category: 'utility',
  description: 'Mesure le temps de réponse et la latence du bot',

  async execute({ sock, m }) {
    const start = Date.now();
    const sentMsg = await sock.sendMessage(m.chat, { text: '⚡ Calcul de la latence...' }, { quoted: m });
    const latency = Date.now() - start;

    await sock.sendMessage(m.chat, {
      text: `🚀 *Pong !*\n⏱️ *Latence :* \`${latency} ms\`\n📶 *Statut :* Opérationnel`,
      edit: sentMsg.key
    });
  }
};
