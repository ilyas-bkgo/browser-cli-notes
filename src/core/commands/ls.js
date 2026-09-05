import { getFoldersByParent, getNotesByFolder } from "../../storage/db.js";

export const lsCommand = {
  name: "ls",
  description: "List directory contents",
  execute: async (args, flags, context) => {
    const [folders, notes] = await Promise.all([
      getFoldersByParent(context.db, context.currentFolderId),
      getNotesByFolder(context.db, context.currentFolderId)
    ]);

    if (folders.length === 0 && notes.length === 0) {
      return "(empty directory)";
    }

    const folderNames = folders.map((f) => `${f.name}/`);
    const noteNames = notes.map((n) => n.title);

    return [...folderNames, ...noteNames].join("  ");
  }
};