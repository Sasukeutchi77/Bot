export default {
  name: 'partager',
  aliases: ['share'],
  category: 'utility',
  description: "Partage les informations et coordonnées du bot",
  async execute({ m }) {
    await m.reply(`🌐 *Partager le bot :*\nInvitez vos amis à ajouter le bot ou à l'intégrer à vos groupes WhatsApp !`);
  }
};
