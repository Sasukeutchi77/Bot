import os from 'os';

function formatDuration(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d > 0 ? `${d}j ` : ''}${h}h ${m}m ${s}s`;
}

export default {
  name: 'uptime',
  aliases: ['actif', 'runtime'],
  category: 'utility',
  description: 'Affiche le temps de fonctionnement continu du bot et du serveur',

  async execute({ sock, m }) {
    const botUptime = formatDuration(process.uptime ? process.uptime() : 0);
    const serverUptime = formatDuration(os.uptime ? os.uptime() : 0);
    const ramUsage = `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`;

    const text = 
      `╭─「 ⏱️ *STATISTIQUES D'ACTIVITÉ* 」\n` +
      `│\n` +
      `│ 🤖 *Uptime Bot :* ${botUptime}\n` +
      `│ 🖥️ *Uptime Serveur :* ${serverUptime}\n` +
      `│ 💾 *Mémoire RAM :* ${ramUsage}\n` +
      `│ ⚙️ *Plateforme :* ${os.platform()} (${os.arch()})\n` +
      `│\n` +
      `╰────────────────────────`;

    await sock.sendMessage(m.chat, { text }, { quoted: m });
  }
};
