/**
 * index.js - Point d'entrée principal du Bot WhatsApp Multi-Device (Baileys v6+)
 * 
 * Ce fichier gère :
 * 1. La connexion et reconnexion automatique avec gestion des sessions
 * 2. L'affichage du QR Code dans le terminal ou le code d'association (Pairing Code)
 * 3. L'interception des messages entrants et le routage vers lib/messageHandler.js
 * 4. La persistance de configuration (config.json) et le support du mode Public/Privé
 */

import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { handleIncomingMessage } from './lib/messageHandler.js';
import { CommandRegistry } from './lib/commandRegistry.js';

const CONFIG_PATH = path.resolve('./config.json');

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    }
  } catch (err) {
    console.error("[Config Load Error]:", err);
  }
  return {
    botName: "WhatsApp MD Bot",
    ownerNumber: "33612345678",
    ownerName: "Owner",
    prefix: ".",
    mode: "public",
    sudoList: []
  };
}

async function startBot() {
  const config = loadConfig();
  console.log(chalk.cyan.bold(`\n⚡ Démarrage de ${config.botName}...`));

  const sessionDir = path.resolve('./session');
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(chalk.gray(`[Baileys] Version ${version.join('.')} (Latest: ${isLatest})`));

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    generateHighQualityLinkPreview: true,
    browser: ['WhatsApp Bot MD', 'Chrome', '1.0.0']
  });

  // Sauvegarde automatique des identifiants de session
  sock.ev.on('creds.update', saveCreds);

  // Gestion des états de connexion
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log(chalk.yellow("[Auth] Scannez le QR Code ci-dessus pour vous connecter."));
    }

    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log(chalk.red(`[Connexion] Fermée (code: ${statusCode}). Reconnexion : ${shouldReconnect}`));

      if (shouldReconnect) {
        startBot();
      } else {
        console.log(chalk.red.bold("[Session] Déconnecté définitivement. Supprimez le dossier ./session et relancez."));
      }
    } else if (connection === 'open') {
      console.log(chalk.green.bold(`\n✅ Bot connecté avec succès !`));
      console.log(chalk.green(`👤 Numéro du Bot : ${sock.user.id.split(':')[0]}`));
      console.log(chalk.green(`🌐 Mode actuel : ${config.mode.toUpperCase()}`));
      console.log(chalk.green(`🔘 Préfixe : [ ${config.prefix} ]\n`));
    }
  });

  // Gestion des messages entrants
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.message) continue;

      try {
        await handleIncomingMessage(sock, msg, config);
      } catch (err) {
        console.error(chalk.red("[Handler Error]:"), err);
      }
    }
  });
}

startBot().catch(console.error);
