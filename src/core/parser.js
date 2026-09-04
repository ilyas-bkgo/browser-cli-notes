function tokenize(input) {
  const tokens = [];
  let currentToken = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === " " && !inQuotes) {
      if (currentToken.length > 0) {
        tokens.push(currentToken);
        currentToken = "";
      }
    } else {
      currentToken += char;
    }
  }

  if (inQuotes) {
    throw new Error("SyntaxError: Unterminated quote");
  }

  if (currentToken.length > 0) {
    tokens.push(currentToken);
  }

  return tokens;
}

function parseTokens(tokens) {
  if (tokens.length === 0) {
    return { command: "", args: [], flags: {} };
  }

  const [command, ...rest] = tokens;
  const args = [];
  const flags = {};

  for (const token of rest) {
    if (token.startsWith("--")) {
      const flagBody = token.slice(2);
      if (flagBody.includes("=")) {
        const [key, value] = flagBody.split("=");
        flags[key] = value;
      } else {
        flags[flagBody] = true;
      }
    } else if (token.startsWith("-") && token.length > 1) {
      const shortFlags = token.slice(1).split("");
      for (const char of shortFlags) {
        flags[char] = true;
      }
    } else {
      args.push(token);
    }
  }

  return { command, args, flags };
}


export function parseInput(rawInput) {
  const tokens = tokenize(rawInput);
  return parseTokens(tokens);
}