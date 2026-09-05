import JSZip from 'jszip';

// Import de tous les fichiers de commandes dynamiquement
const commandFiles = import.meta.glob('../../commands/*.js', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

// Import de tous les modules lib dynamiquement
const libFiles = import.meta.glob('../../lib/*.js', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

// Fichiers racine du projet WhatsApp
import indexJs from '../../index.js?raw';
import launcherCjs from '../../launcher.cjs?raw';
import startSh from '../../start.sh?raw';
import configJs from '../../config.js?raw';
import configJson from '../../config.json?raw';
import botPackageJson from '../../bot.package.json?raw';
import readmeMd from '../../README.md?raw';
import envContent from '../../.env?raw';

export async function generateCompleteProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // 1. Fichiers racine
  zip.file('index.js', indexJs);
  zip.file('launcher.cjs', launcherCjs);
  zip.file('start.sh', startSh);
  zip.file('config.js', configJs);
  zip.file('config.json', configJson);
  zip.file('package.json', botPackageJson);
  zip.file('README.md', readmeMd);
  zip.file('.env', envContent);
  zip.file('.env.example', `BOT_NAME=WhatsApp MD Bot\nOWNER_NUMBER=33612345678\nOWNER_NAME=Propriétaire\nPREFIX=.\nBOT_MODE=public\nSESSION_ID=\n`);
  zip.file('.gitignore', `node_modules/\nsession/\ndata/\n.env\n*.log\n`);

  // 2. Dossiers requis
  zip.folder('session')?.file('.gitkeep', '');
  const dataFolder = zip.folder('data');
  dataFolder?.file('groupConfig.json', '{}');
  dataFolder?.file('userEconomy.json', '{}');
  dataFolder?.file('warns.json', '{}');
  dataFolder?.file('banned.json', '[]');

  // 3. Dossier assets/
  const assetsFolder = zip.folder('assets');
  assetsFolder?.file('README.txt', 'Placez ici vos images, logos et stickers du bot (ex: image1.jpg à image5.jpg)');

  // 4. Dossier lib/ (tous les 29 modules)
  const libFolder = zip.folder('lib');
  for (const [pathKey, content] of Object.entries(libFiles)) {
    const filename = pathKey.split('/').pop();
    if (filename) {
      libFolder?.file(filename, content);
    }
  }

  // 5. Dossier commands/ (toutes les 126+ commandes)
  const commandsFolder = zip.folder('commands');
  for (const [pathKey, content] of Object.entries(commandFiles)) {
    const filename = pathKey.split('/').pop();
    if (filename) {
      commandsFolder?.file(filename, content);
    }
  }

  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
}

export const generateImprovedCommandsZip = generateCompleteProjectZip;
