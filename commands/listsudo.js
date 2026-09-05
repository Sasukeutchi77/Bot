import { getSudoList } from '../lib/ownerSystem.js';

export default {
  name: 'listsudo',
  category: 'owner',
  description: 'Affiche la liste des modérateurs Sudo',
  async execute({ m }) {
    const list = getSudoList();
    if (!list.length) return m.reply('ℹ️ Aucun utilisateur Sudo configuré.');
    await m.reply(`👑 *LISTE SUDO :*\n\n${list.map((n, i) => `${i + 1}. +${n}`).join('\n')}`);
  }
};
