// Moteur TicTacToe multi-salons évitant les collisions de parties
const games = new Map();

export default {
  name: 'tictactoe',
  aliases: ['ttt', 'morpion'],
  category: 'games',
  groupOnly: true,
  description: 'Jeu de Morpion interactif isolé par groupe WhatsApp',

  async execute({ sock, m, args }) {
    const chatId = m.chat;
    const subAction = (args[0] || '').toLowerCase();
    const currentGame = games.get(chatId);

    // 1. Abandonner / Réinitialiser la partie
    if (subAction === 'surrender' || subAction === 'quit' || subAction === 'reset') {
      if (!currentGame) {
        return m.reply("❌ Aucune partie n'est en cours dans ce groupe.");
      }
      games.delete(chatId);
      return m.reply("🏳️ La partie de Morpion a été réinitialisée.");
    }

    // 2. Commencer une nouvelle partie
    if (!currentGame) {
      const opponentJid = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);
      if (!opponentJid) {
        return m.reply(
          "🎮 *MORPION (TicTacToe)*\n\n" +
          "Pour défier quelqu'un, mentionnez-le ou répondez à son message :\n" +
          "👉 `.ttt @adversaire`\n\n" +
          "Pour abandonner : `.ttt reset`"
        );
      }

      if (opponentJid === m.sender) {
        return m.reply("❌ Vous ne pouvez pas jouer contre vous-même.");
      }

      const newGame = {
        playerX: m.sender,
        playerO: opponentJid,
        board: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        turn: m.sender,
        moves: 0
      };

      games.set(chatId, newGame);

      return sock.sendMessage(chatId, {
        text:
          `🎮 *NOUVELLE PARTIE DE MORPION*\n\n` +
          `❌ Joueur 1 (X) : @${m.sender.split('@')[0]}\n` +
          `⭕ Joueur 2 (O) : @${opponentJid.split('@')[0]}\n\n` +
          `${renderBoard(newGame.board)}\n\n` +
          `👉 C'est à @${m.sender.split('@')[0]} de commencer !\n` +
          `Tapez `.ttt <1-9>` pour jouer un coup.`,
        mentions: [m.sender, opponentJid]
      }, { quoted: m });
    }

    // 3. Jouer un coup
    const position = parseInt(args[0], 10);
    if (isNaN(position) || position < 1 || position > 9) {
      return m.reply(
        `⚠️ Numéro de case invalide !\n` +
        `Choisissez un chiffre entre 1 et 9 correspondant à une case libre :\n\n` +
        `${renderBoard(currentGame.board)}`
      );
    }

    if (m.sender !== currentGame.turn) {
      return m.reply("⏳ Ce n'est pas encore votre tour de jouer !");
    }

    const index = position - 1;
    if (currentGame.board[index] === 'X' || currentGame.board[index] === 'O') {
      return m.reply("❌ Cette case est déjà occupée ! Choisissez-en une autre.");
    }

    const symbol = (m.sender === currentGame.playerX) ? 'X' : 'O';
    currentGame.board[index] = symbol;
    currentGame.moves++;

    // Vérification de victoire
    if (checkWinner(currentGame.board, symbol)) {
      games.delete(chatId);
      return sock.sendMessage(chatId, {
        text:
          `🏆 *VICTOIRE !*\n\n` +
          `Félicitations @${m.sender.split('@')[0]}, vous remportez la partie !\n\n` +
          `${renderBoard(currentGame.board)}`,
        mentions: [m.sender]
      }, { quoted: m });
    }

    // Vérification de match nul
    if (currentGame.moves >= 9) {
      games.delete(chatId);
      return sock.sendMessage(chatId, {
        text:
          `🤝 *MATCH NUL !*\n\n` +
          `Toutes les cases ont été jouées sans vainqueur.\n\n` +
          `${renderBoard(currentGame.board)}`
      });
    }

    // Passage au tour suivant
    currentGame.turn = (currentGame.turn === currentGame.playerX)
      ? currentGame.playerO
      : currentGame.playerX;

    return sock.sendMessage(chatId, {
      text:
        `🎮 *MORPION*\n\n` +
        `${renderBoard(currentGame.board)}\n\n` +
        `👉 C'est au tour de @${currentGame.turn.split('@')[0]} (${currentGame.turn === currentGame.playerX ? 'X' : 'O'})\n` +
        `Tapez `.ttt <chiffre>``,
      mentions: [currentGame.turn]
    }, { quoted: m });
  }
};

function renderBoard(b) {
  const formatCell = (val) => {
    if (val === 'X') return '❌';
    if (val === 'O') return '⭕';
    return `*${val}* `;
  };

  return (
    `┌───┬───┬───┐\n` +
    `│ ${formatCell(b[0])} │ ${formatCell(b[1])} │ ${formatCell(b[2])} │\n` +
    `├───┼───┼───┤\n` +
    `│ ${formatCell(b[3])} │ ${formatCell(b[4])} │ ${formatCell(b[5])} │\n` +
    `├───┼───┼───┤\n` +
    `│ ${formatCell(b[6])} │ ${formatCell(b[7])} │ ${formatCell(b[8])} │\n` +
    `└───┴───┴───┘`
  );
}

function checkWinner(board, s) {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lignes
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colonnes
    [0, 4, 8], [2, 4, 6]             // Diagonales
  ];

  return winConditions.some(([a, b, c]) => board[a] === s && board[b] === s && board[c] === s);
}
