import { getSudoList } from '../lib/ownerSystem.js';

export default {
  name: 'sudo',
  category: 'owner',
  description: 'Gestion générale des modérateurs Sudo',
  async execute({ m }) {
    const list = getSudoList();
    await m.reply(`👑 Modérateurs sudo enregistrés : ${list.length}`);
  }
};
