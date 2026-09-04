// src/main.js
import { openDatabase, addFolder, getFoldersByParent } from "./storage/db.js";
import { CommandRegistry } from "./core/registry.js";
import { parseInput } from "./core/parser.js";
import { initTerminal, appendTerminalLine } from "./ui/terminal.js";
import { mkdirCommand } from "./core/commands/mkdir.js";

async function startApp() {
  // 1. Open IDB Connection
  const db = await openDatabase();

  // 2. State management for current active shell context
  const context = {
    db: db,
    currentFolderId: null, // null represents root "/" directory
    currentPath: "/"
  };

  const registry = new CommandRegistry();
  registry.register(mkdirCommand);

  // 3. Mount terminal UI
  initTerminal(async (rawInput) => {
    if (!rawInput.trim()) return;

    appendTerminalLine(`$ ${rawInput}`, true);

    try {
      const parsed = parseInput(rawInput);
      // Pass context (containing active db connection and working path)
      const result = await registry.execute(parsed, context);

      if (result) {
        appendTerminalLine(result);
      }
    } catch (err) {
      appendTerminalLine(`Error: ${err.message}`);
    }
  });
}

startApp();