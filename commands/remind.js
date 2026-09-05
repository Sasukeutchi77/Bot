import { scheduleJob } from '../lib/scheduler.js';

export default {
  name: 'remind',
  aliases: ['rappel'],
  category: 'utility',
  description: 'Programme un rappel avec notification (ex: .remind 10m Acheter du pain)',
  async execute({ sock, m, args }) {
    const timeStr = args[0];
    const text = args.slice(1).join(' ');
    if (!timeStr || !text) return m.reply('❌ Format : *.remind 5m Message de rappel*');
    const mins = parseInt(timeStr);
    if (isNaN(mins) || mins <= 0) return m.reply('❌ Durée invalide (en minutes).');
    const delay = mins * 60 * 1000;
    scheduleJob(`remind_${m.sender}_${Date.now()}`, delay, async () => {
      await sock.sendMessage(m.chat, { text: `⏰ *RAPPEL :* ${text}` });
    });
    await m.reply(`✅ Rappel programmé dans *${mins} minute(s)*.`);
  }
};
