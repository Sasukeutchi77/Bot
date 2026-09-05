import { removeSudo } from '../lib/ownerSystem.js';

export default {
  name: 'delsudo',
  category: 'owner',
  description: 'Supprime un utilisateur de la liste Sudo',
  async execute({ m, args, quoted, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    const num = (quoted ? quoted.sender.split('@')[0] : args[0]) || '';
    if (!num) return m.reply('❌ Précisez le numéro.');
    removeSudo(num);
    await m.reply(`👤 @${num} a été retiré de la liste Sudo.`, { mentions: [num + '@s.whatsapp.net'] });
  }
};
