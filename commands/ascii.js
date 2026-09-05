export default {
  name: 'ascii',
  category: 'tools',
  description: 'Convertit un texte court en bannières textuelles stylisées',
  async execute({ m, args }) {
    const text = args.join(' ');
    if (!text) return m.reply('❌ Précisez un mot à convertir.');
    const banner = text.split('').map(c => `[ ${c.toUpperCase()} ]`).join(' ');
    await m.reply(`\`\`\`\n${banner}\n\`\`\``);
  }
};
