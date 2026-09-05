export default {
  name: 'dare',
  aliases: ['defi', 'action'],
  category: 'games',
  description: "Donne un gage ou une action à relever",
  async execute({ m }) {
    const dares = [
      'Envoie une note vocale en chantant le refrain de ta chanson préférée !',
      'Change ta photo de profil WhatsApp pendant 1 heure avec une image choisie par le groupe !',
      "Écris un poème en 4 vers pour l'admin du groupe.",
      'Raconte ta pire honte vécue en public !'
    ];
    const pick = dares[Math.floor(Math.random() * dares.length)];
    await m.reply(`🔥 *DÉFI / ACTION :*\n\n${pick}`);
  }
};
