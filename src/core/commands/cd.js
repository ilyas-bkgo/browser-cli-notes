import { getFoldersByParent } from "../../storage/db.js";

export const cdCommand = {
  name: "cd",
  description: "Change current directory",
  execute: async (args, flags, context) => {
    const rawPath = args[0] ?? "~";

    // "~" and a leading "/" both mean "start from root"
    const isAbsolute = rawPath === "~" || rawPath.startsWith("/");
    const segments = rawPath.replace(/^~/, "").split("/").filter(Boolean);

    // Work on a copy so a bad path in the middle doesn't leave a half-moved stack
    let stack = isAbsolute ? [context.folderStack[0]] : [...context.folderStack];

    for (const segment of segments) {
      if (segment === ".") continue;

      if (segment === "..") {
        if (stack.length > 1) stack.pop();
        continue;
      }

      const parentId = stack[stack.length - 1].id;
      const siblings = await getFoldersByParent(context.db, parentId);
      const match = siblings.find((f) => f.name === segment);

      if (!match) {
        return `cd: ${segment}: No such directory`;
      }

      stack.push({ id: match.id, name: match.name });
    }

    context.folderStack = stack;
    context.currentFolderId = stack[stack.length - 1].id;
    context.currentPath = stack.length === 1
      ? "/"
      : "/" + stack.slice(1).map((f) => f.name).join("/");

    return null; // like real cd: no output on success
  }
};
