import { addNote } from "../../storage/db.js";

export const touchCommand = {
  name: "touch",
  description: "Create an empty note file",
  execute: async (args, flags, context) => {
    if (args.length === 0) {
      return "touch: missing file operand";
    }

    const noteTitle = args[0];
    const newId = await addNote(context.db, noteTitle, "", context.currentFolderId);

    return `Created note '${noteTitle}' (ID ${newId})`;
  }
};