import { getUserData } from '../lib/usageSystem.js';
import { readJson, writeJson } from '../lib/safeStore.js';
import path from 'path';

const DB_PATH = path.resolve('./data/userEconomy.json');

export default {
  name: 'daily',
  category: 'games',
  description: "Récupère votre récompense quotidienne d'expérience et pièces",
  async execute({ m }) {
    const db = readJson(DB_PATH, {});
    const now = Date.now();
    const user = db[m.sender] || { exp: 0, coins: 50, rank: 'Bronze', dailyClaimed: null };
    if (user.dailyClaimed && (now - user.dailyClaimed < 86400000)) {
      const waitHours = Math.ceil((86400000 - (now - user.dailyClaimed)) / 3600000);
      return m.reply(`⏳ Vous avez déjà réclamé votre bonus. Revenez dans *${waitHours}h*.`);
    }
    user.dailyClaimed = now;
    user.coins = (user.coins || 0) + 100;
    user.exp = (user.exp || 0) + 50;
    db[m.sender] = user;
    writeJson(DB_PATH, db);
    await m.reply(`🎁 *Récompense journalière collectée !*\n💰 +100 pièces\n⭐ +50 EXP\n🪙 Total pièces : *${user.coins}*`);
  }
};
