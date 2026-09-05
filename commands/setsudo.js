import { addSudo } from '../lib/ownerSystem.js';

export default {
  name: 'setsudo',
  category: 'owner',
  description: 'Définit les droits sudo pour un utilisateur',
  async execute({ m, args, quoted, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    const num = (quoted ? quoted.sender.split('@')[0] : args[0]) || '';
    if (!num) return m.reply('❌ Précisez le numéro.');
    addSudo(num);
    await m.reply(`👑 Droits Sudo accordés à @${num}.`, { mentions: [num + '@s.whatsapp.net'] });
  }
};
