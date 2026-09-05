# WhatsApp Bot Multi-Device (Version Complète Corrigée)

Ce projet est la version complète et opérationnelle de votre Bot WhatsApp Baileys MD.
Toutes les commandes ont été corrigées, sécurisées et testées, avec un design de menu moderne et toutes les fonctionnalités intégrées.

---

## 📋 Structure Complète du Projet

```text
├── index.js                  # Point d'entrée principal (Connexion Baileys, gestionnaire de session)
├── config.json               # Fichier de configuration (Numéro Owner, mode public/privé, préfixe)
├── package.json              # Dépendances du bot (Baileys v6+, axios, pino, etc.)
├── .env.example              # Variables d'environnement
├── README.md                 # Guide d'utilisation et d'installation
├── lib/
│   ├── messageHandler.js     # Dispatcher des messages avec support du mode Privé/Public
│   ├── targetResolver.js     # Détecteur multi-device (@mentions, réponses, numéros, LIDs)
│   └── commandRegistry.js    # Enregistreur automatique des commandes
└── commands/
    ├── menu.js               # Nouveau Menu Stylé avec 7 catégories et sous-menus (.menu media, etc.)
    ├── private.js            # Commande .private (Self-mode persistant dans config.json)
    ├── public.js             # Commande .public (Rétablit l'accès public)
    ├── vv.js                 # Anti-Vue Unique (photos & vidéos viewOnceMessageV2)
    ├── calc.js               # Calculatrice sécurisée anti-faille RCE
    ├── tagall.js             # Appel de tous les membres avec support des LIDs WhatsApp
    ├── kick.js               # Expulsion sécurisée avec immunité des administrateurs
    ├── warn.js               # Système de 3 avertissements avec expulsion automatique
    ├── antilink.js           # Détecteur de liens (.antilink on / delete / kick)
    ├── ytmp4.js              # Téléchargement vidéo YouTube sans blocage 403
    ├── ai.js                 # Assistant IA conversationnel avec timeout
    ├── tictactoe.js          # Morpion multijoueur interactif en salon
    ├── song.js               # Recherche et téléchargement audio
    ├── sticker.js            # Génération d'autocollants WhatsApp
    ├── ping.js               # Test de vitesse et de latence
    ├── uptime.js             # Statistiques d'activité du serveur
    ├── mute.js & unmute.js   # Fermeture et ouverture de discussion de groupe
    ├── promote.js & demote.js# Gestion des droits administrateurs
    ├── hidetag.js            # Mentions invisibles pour annonces de groupe
    ├── antichannel.js        # Protection anti-liens de chaînes
    ├── translate.js          # Traducteur multi-langues
    ├── weather.js            # Météo en direct
    ├── qrcode.js             # Générateur de QR Code
    ├── quiz.js               # Quiz de culture générale
    └── rps.js                # Pierre - Feuille - Ciseaux
```

---

## 🚀 Installation & Démarrage

### 1. Prérequis
- **Node.js v18** ou supérieur installé sur votre machine / VPS.

### 2. Installation des dépendances
```bash
npm install
```

### 3. Configuration
Ouvrez le fichier `config.json` et remplacez le numéro du propriétaire par le vôtre :
```json
{
  "botName": "WhatsApp MD Bot",
  "ownerNumber": "33612345678",
  "prefix": ".",
  "mode": "public"
}
```

### 4. Lancement du bot
```bash
npm start
```
Scannez le **QR Code** qui s'affiche dans votre terminal avec l'application WhatsApp (Appareils connectés > Connecter un appareil).

---

## 🛠️ Commandes Principales

- **`.menu`** : Affiche le tableau de bord interactif divisé en 7 catégories.
- **`.menu media`** : Affiche uniquement les commandes multimédia.
- **`.private`** : Verrouille le bot pour que seul le propriétaire puisse exécuter des commandes.
- **`.public`** : Réouvre le bot à tous les utilisateurs.
- **`.vv`** : Récupère une photo ou vidéo éphémère en y répondant.
- **`.calc 15 * 4 + 10`** : Calcule le résultat sans risque de sécurité.
- **`.tagall`** : Mentionne tous les membres d'un groupe sans omission.
- **`.warn @membre`** : Donne un avertissement (expulsion automatique à 3).
- **`.antilink on`** : Active la protection anti-liens de groupe.
