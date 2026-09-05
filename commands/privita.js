import privateCmd, { getBotMode, setBotMode, isBotAccessible } from './private.js';

export { getBotMode, setBotMode, isBotAccessible };

export default {
  ...privateCmd,
  name: 'privita',
  aliases: ['private', 'prive', 'privé', 'self', 'privatemode'],
  description: 'Active le mode privé (seul le propriétaire peut utiliser le bot)'
};
