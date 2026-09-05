export default {
  name: 'hidetag',
  aliases: ['htag', 'tag'],
  category: 'moderation',
  description: 'Diffuse un message à tous les membres du groupe avec mentions invisibles',

  async execute({ sock, m, args, isGroup, isSenderAdmin }) {
    if (!isGroup) return m.reply("❌ Cette commande ne s'utilise que dans un groupe.");
    if (!isSenderAdmin) return m.reply("❌ Seuls les administrateurs peuvent utiliser hidetag.");

    const groupMeta = await sock.groupMetadata(m.chat);
    const participants = groupMeta.participants.map(p => p.id);
    const announcement = args.join(' ') || '📢 Annonce aux membres du groupe';

    await sock.sendMessage(m.chat, {
      text: announcement,
      mentions: participants
    });
  }
};
