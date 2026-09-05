import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve('./data/antichannel.json');

function loadData() {
  try {
    if (fs.existsSync(DB_PATH)) return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch (e) {}
  return {};
}

function saveData(data) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}
}

export default {
  name: 'antichannel',
  aliases: ['nochannel'],
  category: 'security',
  description: 'Supprime automatiquement les liens de chaînes WhatsApp partagés dans le groupe',

  async execute({ m, args, isGroup, isSenderAdmin }) {
    if (!isGroup) return m.reply("❌ Commande réservée aux groupes.");
    if (!isSenderAdmin) return m.reply("❌ Vous devez être administrateur.");

    const state = (args[0] || '').toLowerCase();
    const db = loadData();

    if (state === 'on' || state === 'enable' || state === '1') {
      db[m.chat] = true;
      saveData(db);
      return m.reply("🔒 *Anti-Channel Activé.* Tout lien de chaîne WhatsApp sera immédiatement supprimé.");
    } else if (state === 'off' || state === 'disable' || state === '0') {
      delete db[m.chat];
      saveData(db);
      return m.reply("🔓 *Anti-Channel Désactivé.*");
    } else {
      const active = !!db[m.chat];
      return m.reply(`⚙️ *Statut Anti-Channel :* ${active ? 'Activé ✅' : 'Désactivé ❌'}\n_Utilisation :_ *.antichannel on* ou *.antichannel off*`);
    }
  }
};
