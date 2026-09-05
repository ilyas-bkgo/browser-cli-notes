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
  
  async execute(parsedInput, context = {}) {
  const { command, args, flags } = parsedInput;

  console.log(`[Registry] Attempting to run '${command}' with args:`, args);
  console.log(`[Registry] Registered commands:`, Array.from(this.commands.keys()));

  if (!command) return "";

  const cmd = this.commands.get(command);
  if (!cmd) {
    console.error(`[Registry] Command '${command}' NOT found in Map!`);
    return `${command}: command not found`;
  }

  try {
    const output = await cmd.execute(args, flags, context);
    console.log(`[Registry] '${command}' executed successfully. Output:`, output);
    return output;
  } catch (err) {
    console.error(`[Registry] Exception inside '${command}':`, err);
    return `Error executing ${command}: ${err.message}`;
  }
}
}