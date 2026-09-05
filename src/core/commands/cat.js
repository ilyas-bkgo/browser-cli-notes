import { getNotesByFolder } from "../../storage/db.js";

export const catCommand = {
  name: "cat",
  description: "Display note content",
  execute: async (args, flags, context) => {
    if (args.length === 0) {
      return "cat: missing file operand";
    }

    const filename = args[0];
    const notes = await getNotesByFolder(context.db, context.currentFolderId);
    const note = notes.find((n) => n.title === filename);

    if (!note) {
      return `cat: ${filename}: No such file or directory`;
    }

    return note.content || "(file is empty)";
  }
};