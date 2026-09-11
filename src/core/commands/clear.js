import { clearTerminal } from "../../ui/terminal.js";

export const clearCommand = {
  name: "clear",
  description: "Clear the terminal screen",
  execute: async () => {
    clearTerminal();
    return null; // nothing to append — the screen itself was just wiped
  }
};