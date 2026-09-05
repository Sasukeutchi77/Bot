import os from 'os';

export default {
  name: 'status',
  category: 'utility',
  description: "Affiche l'état de santé du bot et des serveurs",
  async execute({ m }) {
    const text = `🟢 *STATUT DU BOT : EN LIGNE*\n🖥️ OS : ${os.platform()} ${os.arch()}\n💾 Mémoire libre : ${Math.round(os.freemem() / 1024 / 1024)} MB`;
    await m.reply(text);
  }
};
