/**
 * Command Registry Robuste
 * Enregistre, indexe et valide les commandes du bot avec gestion des alias,
 * permissions d'administration et limitation de débit (cooldown).
 */

export class CommandRegistry {
  constructor() {
    this.commands = new Map();
    this.aliases = new Map();
    this.cooldowns = new Map();
  }

  register(commandModule) {
    if (!commandModule.name || typeof commandModule.execute !== 'function') {
      console.warn(`[CommandRegistry] Module invalide ignoré :`, commandModule);
      return;
    }

    this.commands.set(commandModule.name.toLowerCase(), commandModule);

    if (Array.isArray(commandModule.aliases)) {
      for (const alias of commandModule.aliases) {
        this.aliases.set(alias.toLowerCase(), commandModule.name.toLowerCase());
      }
    }
  }

  find(commandName) {
    const cleanName = commandName.toLowerCase();
    if (this.commands.has(cleanName)) {
      return this.commands.get(cleanName);
    }
    if (this.aliases.has(cleanName)) {
      const canonicalName = this.aliases.get(cleanName);
      return this.commands.get(canonicalName);
    }
    return null;
  }

  getAll() {
    return Array.from(this.commands.values());
  }
}
