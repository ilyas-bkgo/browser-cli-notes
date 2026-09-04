import { addFolder } from "../../storage/db.js";

export const mkdirCommand = {
  name: "mkdir",
  description: "Create a directory",
  execute: async (args, flags, context) => {
    if (args.length === 0) {
      return "mkdir: missing operand";
    }
    const folderName = args[0];
    const newId = await addFolder(context.db, folderName, context.currentFolderId);

    // this will be hooked into IndexedDB / FileSystem later!
    return `Creating directory '${folderName}' created with ID ${newId}.)`;
  }
};