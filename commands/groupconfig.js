import { getGroupConfig } from '../lib/groupConfig.js';

export default {
  name: 'groupconfig',
  category: 'group',
  description: 'Affiche la configuration complète du groupe',
  async execute({ m, isGroup }) {
    if (!isGroup) return m.reply('❌ Commande de groupe.');
    const c = getGroupConfig(m.chat);
    const text = `╭─「 ⚙️ *CONFIG DU GROUPE* 」\n│ 🛡️ Antilink : ${c.antilink || 'Non'}\n│ 🚫 Antichannel : ${c.antichannel ? 'Oui' : 'Non'}\n│ 🏷️ Antitag : ${c.antitag ? 'Oui' : 'Non'}\n│ 👋 Welcome : ${c.welcome ? 'Oui' : 'Non'}\n│ 👋 Goodbye : ${c.goodbye ? 'Oui' : 'Non'}\n╰────────────────────────`;
    await m.reply(text);
  }
};
