/**
 * launcher.cjs - Superviseur de processus pour WhatsApp Bot MD
 * Lance index.js, intercepte les arrêts imprévus et relance automatiquement
 */

const { spawn } = require('child_process');
const path = require('path');

function start() {
  const args = [path.join(__dirname, 'index.js'), ...process.argv.slice(2)];
  console.log('[Launcher] Initialisation du bot WhatsApp...');

  const p = spawn(process.argv[0], args, {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
  });

  p.on('message', (data) => {
    if (data === 'reset') {
      console.log('[Launcher] Demande de redémarrage reçue.');
      p.kill();
      start();
    }
  });

  p.on('exit', (code) => {
    console.error(`[Launcher] Processus terminé avec le code: ${code}`);
    if (code === 0 || code === 1 || code === null) {
      setTimeout(() => start(), 2000);
    }
  });
}

start();
