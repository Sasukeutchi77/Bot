export default {
  name: 'whoami',
  category: 'utility',
  description: 'Affiche vos informations de session et votre numéro',
  async execute({ m, isSenderAdmin, isOwner }) {
    const role = isOwner ? 'Propriétaire 👑' : (isSenderAdmin ? 'Administrateur 🛡️' : 'Membre 👤');
    await m.reply(`🆔 *Vos coordonnées :*\n• Numéro : +${m.sender.split('@')[0]}\n• Statut : *${role}*`);
  }
};
