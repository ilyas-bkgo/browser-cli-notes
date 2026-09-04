export const catCommand = {
    name: "cat",
    description: "Read file contents",
    execute: (args, flags, context) => {
        if (args.length === 0) return "cat: missing file argument";
        return `Reading contents of ${args[0]}...`;
    }
};