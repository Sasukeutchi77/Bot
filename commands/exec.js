import { exec } from 'child_process';

export default {
  name: 'exec',
  category: 'owner',
  description: 'Exécute une commande shell sur le serveur (Propriétaire uniquement)',
  async execute({ m, args, isOwner }) {
    if (!isOwner) return m.reply('❌ Réservé au propriétaire.');
    const cmd = args.join(' ');
    if (!cmd) return m.reply('❌ Précisez la commande shell.');
    exec(cmd, (err, stdout, stderr) => {
      if (err) return m.reply(`❌ Erreur :\n${err.message}`);
      m.reply(`📤 *Sortie :*\n\`\`\`${stdout || stderr || 'Exécuté avec succès.'}\`\`\``);
    });
  }
};
