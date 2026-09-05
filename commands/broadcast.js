export default {
  name: 'broadcast',
  aliases: ['bc'],
  category: 'owner',
  description: 'Diffuse un message à tous les groupes du bot',
  async execute({ sock, m, args, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    const msg = args.join(' ');
    if (!msg) return m.reply('❌ Précisez le message à diffuser.');
    const chats = await sock.groupFetchAllParticipating();
    const groups = Object.keys(chats);
    await m.reply(`📢 Diffusion en cours vers ${groups.length} groupes...`);
    for (const gid of groups) {
      await sock.sendMessage(gid, { text: `📢 *ANNONCE OFFICIELLE*\n\n${msg}` });
    }
    await m.reply('✅ Diffusion terminée avec succès.');
  }
};
