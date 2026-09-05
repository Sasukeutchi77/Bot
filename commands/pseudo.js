export default {
  name: 'pseudo',
  category: 'fun',
  description: 'Génère un pseudonyme stylisé pour vos jeux ou profils',
  async execute({ m, args }) {
    const base = args.join(' ') || 'Shadow';
    const styles = [`꧁༒${base}༒꧂`, `⚡${base}⚡`, `★${base}★`, `☠️${base}☠️`];
    await m.reply(`🎭 *Suggestions de pseudos :*\n\n${styles.join('\n')}`);
  }
};
