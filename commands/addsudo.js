import { addSudo } from '../lib/ownerSystem.js';

export default {
  name: 'addsudo',
  category: 'owner',
  description: 'Ajoute un utilisateur à la liste Sudo',
  async execute({ m, args, quoted, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    const num = (quoted ? quoted.sender.split('@')[0] : args[0]) || '';
    if (!num) return m.reply('❌ Précisez le numéro.');
    addSudo(num);
    await m.reply(`👑 @${num} a été ajouté à la liste Sudo.`, { mentions: [num + '@s.whatsapp.net'] });
  }
};
