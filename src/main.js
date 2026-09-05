import { CommandRegistry } from "./core/registry.js";
import { parseInput } from "./core/parser.js";

// command modules
import { mkdirCommand } from "./core/commands/mkdir.js";
import { lsCommand } from "./core/commands/ls.js";
import { touchCommand } from "./core/commands/touch.js";
import { catCommand } from "./core/commands/cat.js";

import { openDatabase } from "./storage/db.js";
import { initTerminal, appendTerminalLine } from "./ui/terminal.js";

async function startApp() {
  // initialize IndexedDB
  const db = await openDatabase();

  // set initial state context
  const context = {
    db: db,
    currentFolderId: "root",
    currentPath: "/"
  };

  // 4. Instantiate and register commands
  const registry = new CommandRegistry();
  registry.register(mkdirCommand);
  registry.register(lsCommand);
  registry.register(touchCommand);
  registry.register(catCommand);

  // initialize terminal UI listener
  initTerminal(async (rawInput) => {
    if (!rawInput.trim()) return;

    console.log('Raw input : ', rawInput);
    appendTerminalLine(`$ ${rawInput}`, true);

    try {
      const parsed = parseInput(rawInput);
      console.log('Parsed output : ', parsed);

      const result = await registry.execute(parsed, context);
      console.log('Execution result : ', result);

      if (result) {
        appendTerminalLine(result);
      } else {
        console.warn('execution empty or undefined result');
      }

    } catch (err) {
      console.log('Pipeline errror: ', err);
      appendTerminalLine(`Error: ${err.message}`);
    }
  });
}

startApp();