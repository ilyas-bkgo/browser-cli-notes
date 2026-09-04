export class CommandRegistry {
  constructor() {
    this.commands = new Map();
  }

  register(commandDef) {
    if (!commandDef.name || typeof commandDef.execute !== "function") {
      throw new Error("Invalid command definition: must have 'name' and 'execute'");
    }
    this.commands.set(commandDef.name, commandDef);
  }

  // Notice the 'async' keyword here
  async execute(parsedInput, context = {}) {
    const { command, args, flags } = parsedInput;

    if (!command) return "";

    const cmd = this.commands.get(command);
    if (!cmd) {
      return `${command}: command not found`;
    }

    try {
      // Notice the 'await' keyword here
      return await cmd.execute(args, flags, context);
    } catch (err) {
      return `Error executing ${command}: ${err.message}`;
    }
  }
}