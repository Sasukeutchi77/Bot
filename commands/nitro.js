export default {
  name: 'nitro',
  category: 'fun',
  description: 'Génère un faux code cadeau Discord Nitro',
  async execute({ m }) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 16; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    await m.reply(`🎁 *CADEAU DISCORD NITRO :*\nhttps://discord.gift/${code}\n\n_Note : Ceci est une simulation ludique !_`);
  }
};
