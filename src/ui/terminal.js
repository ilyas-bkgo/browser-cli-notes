export function initTerminal(onCommandSubmit) {
  const input = document.getElementById("terminal-input");
  const cursor = document.getElementById("cursor");
  const prompt = document.getElementById("prompt");
  const terminal = document.getElementById("terminal");

  if (!input || !terminal) return;

  input.focus();

  terminal.addEventListener("mousedown", (e) => {
    if (e.target === input) return;
    e.preventDefault();
    input.focus();
  });

  function updateCursor() {
    const text = input.value;

    const span = document.createElement("span");
    span.style.font = getComputedStyle(input).font;
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.whiteSpace = "pre";
    span.textContent = text;

    document.body.appendChild(span);
    const textWidth = span.offsetWidth;
    const inputOffsetLeft = input.offsetLeft;

    cursor.style.left = `${inputOffsetLeft + textWidth}px`;
    span.remove();
  }

  // Handle Enter keypress for command submission
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const rawValue = input.value;
      input.value = "";
      updateCursor();

      if (onCommandSubmit) {
        onCommandSubmit(rawValue);
      }
    }
  });

  input.addEventListener("input", updateCursor);

  input.addEventListener("focus", () => {
    cursor?.classList.remove("hidden");
  });

  input.addEventListener("blur", () => {
    cursor?.classList.add("hidden");
  });

  window.addEventListener("resize", updateCursor);

  updateCursor();
}

export function appendTerminalLine(text, isCommand = false) {
    const terminal = document.getElementById("Terminal");
    const inputContainer = document.getElementById("input-container") || document.getElementById("prompt").parentElement;

    const line = document.createElement("div");
    line.className = isCommand ? "terminal-line command line" : "terminal-line output-line";

    line.textContent = text;

    if (terminal && inputContainer) {
        terminal.insertBefore(line, inputContainer);
        terminal.scrollTop = terminal.scrollHeight;
    }
}