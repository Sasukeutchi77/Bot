/**
 * config.js - Configuration centrale du Bot WhatsApp
 */
import dotenv from 'dotenv';
dotenv.config();

export default {
  botName: process.env.BOT_NAME || "WhatsApp MD Bot",
  ownerNumber: process.env.OWNER_NUMBER || "33612345678",
  ownerName: process.env.OWNER_NAME || "Owner",
  prefix: process.env.PREFIX || ".",
  mode: (process.env.BOT_MODE || "public").toLowerCase(), // 'public' | 'private'
  sessionName: "session",
  sudoList: [],
  autoRead: false,
  antiCall: false,
  welcomeMessage: "Bienvenue dans le groupe @user !",
  goodbyeMessage: "Au revoir @user !",
  maxWarns: 3
};
