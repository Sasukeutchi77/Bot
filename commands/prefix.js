import { setPrefix, getPrefix } from '../lib/prefixManager.js';

export default {
  name: 'prefix',
  category: 'owner',
  description: 'Change le préfixe de commande du bot',
  async execute({ m, args, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    const newP = args[0];
    if (!newP) return m.reply(`Préfixe actuel : [ ${getPrefix(m.chat)} ]\nPour changer : *.prefix !*`);
    setPrefix(m.chat, newP);
    await m.reply(`✅ Préfixe modifié avec succès : [ ${newP} ]`);
  }
};
