import { useState } from "react";

const TextInput = (props) => {
  const [currentInput, setCurrentInput] = useState("");
  const [history, setHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  const handleInput = (e) => {
    const target = e.target;
    const value = target.value;
    changeInput(target, value);
  };

  const changeInput = (target, text) => {
    target.style.width = `${text.length}ch`;
    setCurrentInput(text);
  };

  const pushToHistory = (command) => {
    const newHistory = [...history];
    newHistory.unshift(command);
    setHistory(newHistory);
  };

  const autoFill = ["secret", "passwords.txt", "github.txt"];

  return (
    <input
      spellCheck="false"
      type="text"
      value={currentInput}
      onChange={handleInput}
      onKeyDown={(e) => {
        if (e.key === undefined) {
          return;
        }

        if (e.key === "Enter") {
          props.onEnter(e);
          pushToHistory(currentInput);
          setCurrentInput("");
          return;
        }

        if (e.key === "Tab") {
          e.preventDefault();
          const commands = currentInput.split(" ");
          if (commands.length === 1 || commands[1].length === 0) {
            return;
          }

          const startLetter = commands[1].charAt(0);
          autoFill.forEach((string) => {
            if (string.charAt(0) !== startLetter) {
              return;
            }

            changeInput(e.target, `${commands[0]} ${string}`);
          });
        }

        if (["ArrowUp", "ArrowDown"].includes(e.key)) {
          const newHistoryIndex =
            e.key === "ArrowUp"
              ? Math.min(currentHistoryIndex + 1, history.length - 1)
              : Math.max(currentHistoryIndex - 1, -1);

          changeInput(
            e.target,
            newHistoryIndex === -1 ? "" : history[newHistoryIndex]
          );
          setCurrentHistoryIndex(newHistoryIndex);
        }
      }}
      onBlur={(e) => e.target.focus()}
      autoFocus={true}
      style={{ marginRight: "1px", width: "0ch" }}
    />
  );
};

export default TextInput;
