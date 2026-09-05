export default {
  name: 'style',
  category: 'tools',
  description: 'Applique des polices stylisées à votre texte',
  async execute({ m, args }) {
    const text = args.join(' ');
    if (!text) return m.reply('❌ Précisez le texte à styliser.');
    await m.reply(`𝓣𝓮𝔁𝓽𝓮 𝓼𝓽𝔂𝓵𝓲𝓼𝓮́ :\n\n𝕱𝖔𝖓𝖙 1: 𝔖 ${text}\n𝕱𝖔𝖓𝖙 2: 𝒞 ${text}`);
  }
};
