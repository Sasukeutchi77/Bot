import { removeSudo } from '../lib/ownerSystem.js';

export default {
  name: 'removesudo',
  category: 'owner',
  description: 'Alias pour supprimer un sudo',
  async execute({ m, args, quoted, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    const num = (quoted ? quoted.sender.split('@')[0] : args[0]) || '';
    removeSudo(num);
    await m.reply(`👤 Modérateur @${num} retiré.`, { mentions: [num + '@s.whatsapp.net'] });
  }
};
