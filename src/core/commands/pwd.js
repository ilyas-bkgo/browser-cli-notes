export const pwdCommand = {
  name: "pwd",
  description: "Print the current working directory",
  execute: async (args, flags, context) => {
    return context.currentPath;
  }
};