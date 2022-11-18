import React, { useEffect, useState } from "react";
import TextInput from "./components/TextInput";
import logo from "./logo.svg";
import poweredBy from "./powered-by-vitawind-dark.png";

function App() {
  const [terminalLog, setTerminalLog] = useState([]);
  const [inputAllowed, setInputAllowed] = useState(false);
  const [timeVisited, _] = useState(new Date().toLocaleString("sv-SE"));
  const [userIp, setUserIp] = useState("");
  const [invalidEntriesCount, setInvalidEntriesCount] = useState(0);

  const user = (
    <>
      <span className="font-semibold text-green-400">steffen@ns371934</span>:
      <span className="text-indigo-700">~</span>${" "}
    </>
  );

  const onEnter = (e) => {
    const target = e.target;
    const value = target.value.trim();

    if (e.key !== undefined && e.key === "Enter") {
      const newEntry = [[value, false]];
      if (value) {
        const commands = value.split(" ");
        switch (commands[0]) {
          case "ls": {
            if (commands.length === 1) {
              newEntry.push([
                [
                  ["secret", "text-indigo-700 font-semibold"],
                  "github.txt",
                  "passwords.txt",
                ],
                true,
              ]);
            } else {
              if (["passwords.txt", "github.txt"].includes(commands[1])) {
                newEntry.push([commands[1], true]);
                break;
              }

              if (commands[1] === "secret") {
                newEntry.push(
                  "ls: cannot open directory 'secret': Permission denied"
                );
                break;
              }

              if (commands[1].charAt(0) === "-") {
                if (commands[1] === "-l") {
                  /*
                  total 12
                  drwxr-xr-x+ 4 debian  debian  4096 Nov 18 18:45 debian
                  drwxr-x---+ 8 steffen steffen 4096 Oct 17 20:33 steffen
                  -rw-r--r--  1 root    root       5 Nov 18 17:10 test.text
                  */
                  newEntry.push("total 12");
                  newEntry.push([
                    [
                      "drwxr-xr-x+",
                      "4",
                      "debian",
                      "debian",
                      "4096",
                      "Nov 18",
                      "18:45",
                      ["secret", "text-indigo-700 font-semibold"],
                    ],
                  ]);
                  newEntry.push([
                    [
                      "drwxr-xr-x+",
                      "4",
                      "debian",
                      "debian",
                      "4096",
                      "Nov 18",
                      "18:45",
                      "github.txt",
                    ],
                  ]);
                  newEntry.push([
                    [
                      "drwxr-xr-x+",
                      "4",
                      "debian",
                      "debian",
                      "4096",
                      "Nov 18",
                      "18:45",
                      "passwords.txt",
                    ],
                  ]);
                }

                if (commands[1] === "-a") {
                  newEntry.push([
                    [
                      [".", "text-indigo-700 font-semibold"],
                      ["..", "text-indigo-700 font-semibold"],
                      ["secret", "text-indigo-700 font-semibold"],
                      "github.txt",
                      "passwords.txt",
                    ],
                    true,
                  ]);
                }
                break;
              }

              newEntry.push(
                `ls: cannot access '${commands[1]}': No such file or directory`
              );
            }
            break;
          }

          case "cd": {
            if (!commands[1] || commands[1] === ".") {
              break;
            }

            if (["secret", "secret/", "../", ".."].includes(commands[1])) {
              newEntry.push(`-bash: cd: ${commands[1]}: Permission denied`);
              break;
            }

            newEntry.push(
              `-bash: cd: ${commands[1]}: No such file or directory`
            );
            break;
          }

          case "cat": {
            if (!commands[1]) {
              break;
            }

            switch (commands[1]) {
              case "passwords.txt": {
                newEntry.push(`-bash: cat: ${commands[1]}: Permission denied`);
                break;
              }

              case "github.txt": {
                newEntry.push("It's worth checking out!", [
                  [
                    [
                      "https://github.com/steffenkloster/shell-mockup",
                      "hover:underline cursor-pointer",
                      () => {
                        window.location.href =
                          "https://github.com/steffenkloster/shell-mockup";
                      },
                    ],
                  ],
                ]);
                break;
              }

              default: {
                newEntry.push(`cat: ${commands[1]}: No such file or directory`);
                break;
              }
            }

            break;
          }

          case "w":
          case "who": {
            newEntry.push([
              ["steffen", "pts/1", `${timeVisited} (${userIp})`],
              true,
            ]);
            break;
          }

          case "whoami": {
            newEntry.push("steffen");
            break;
          }

          case "mkdir": {
            if (!commands[1]) {
              newEntry.push("mkdir: missing operand");
              newEntry.push("Try 'mkdir --help' for more information");
              break;
            }

            newEntry.push(
              `mkdir: cannot create directory ‘${commands[1]}’: Permission denied`
            );
            break;
          }

          default: {
            setInvalidEntriesCount(invalidEntriesCount + 1);
            if (invalidEntriesCount === 3) {
              newEntry.push(
                [
                  [
                    [
                      "Hey there curious stranger!",
                      "text-red-600 font-semibold",
                    ],
                  ],
                ],
                "Maybe you should try this instead:",
                [[["cat github.txt", "font-semibold"]]]
              );
              break;
            }

            newEntry.push(`-bash: ${value}: command not found`);
            break;
          }
        }
      }

      addLogToTerminal(newEntry);
      target.style.width = "1px";
      return;
    }
  };

  const addLogToTerminal = (textData, reset = false) => {
    const newTerminalLog = reset ? [] : [...terminalLog];
    const push = (data) => {
      if (!data) {
        return;
      }

      if (typeof data === "string") {
        newTerminalLog.push({
          system: true,
          text: data,
        });
      } else {
        newTerminalLog.push({
          system: data[1] ?? true,
          text: data[0] ?? "",
        });
      }
    };

    if (Array.isArray(textData)) {
      textData.forEach((data) => push(data));
    } else {
      push(textData);
    }

    setTerminalLog(newTerminalLog);

    if (reset) {
      setTimeout(() => {
        setInputAllowed(true);
      }, 500);
    }
  };

  const getIp = async () => {
    try {
      const response = await fetch("https://api.ipify.org/?format=json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const json = await response.json();
      setUserIp(json.ip);
    } catch {
      setUserIp("151.80.30.198");
    }
  };

  useEffect(() => {
    if (userIp !== "") {
      return;
    }

    getIp();
  }, []);

  useEffect(() => {
    setTerminalLog([]);
    setInputAllowed(false);
    setInvalidEntriesCount(0);

    setTimeout(() => {
      addLogToTerminal(
        [
          "Linux ns371934 5.10.0-16-amd64 #1 SMP Debian 5.10.127-2 (2022-07-23) x86_64",
          "",
          "The programs included with the Debian GNU/Linux system are free software;",
          "individual files in /usr/share/doc/*/copyright.",
          "Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent",
          "permitted by applicable law",
          "Last login: Fri Nov 18 13:51:01 2022 from 45.129.56.199",
        ],
        true
      );
    }, 500);
  }, []);

  return (
    <main className="mx-10 flex h-full min-h-screen items-center justify-center">
      <div className="flex h-80 w-[50rem] max-w-full flex-col rounded-lg bg-black">
        <div className="relative flex w-full items-center rounded-t-lg bg-neutral-200 px-2">
          <div className="flex gap-x-1">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>
          <div className="pointer-events-none flex-grow text-ellipsis px-2 py-1 text-center text-xs font-semibold">
            shell — steffen@ns371934: ~ — ssh steffen@151.80.30.198 — 117x20
          </div>
        </div>
        <div className="mt-1 flex flex-grow cursor-text flex-col-reverse overflow-scroll p-1 pt-0 font-mono text-xs text-white">
          {inputAllowed ? (
            <div className="whitespace-nowrap">
              {user}
              <TextInput onEnter={onEnter} />
              <span className="opacity-70">▉</span>
            </div>
          ) : (
            <></>
          )}

          {terminalLog
            .slice(0)
            .reverse()
            .map((output, i) => {
              const text = Array.isArray(output.text) ? (
                <div className="flex gap-x-4">
                  {output.text.map((t, ii) => {
                    return (
                      <div
                        key={`line-${i}-${ii}`}
                        className={Array.isArray(t) ? t[1] : ""}
                        onClick={
                          typeof t !== "string" && t[2] !== undefined
                            ? t[2]
                            : () => {}
                        }
                      >
                        {Array.isArray(t) ? t[0] : t}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>{output.text}</>
              );
              return (
                <div key={`line-${i}`}>
                  {output.system ? <></> : user}
                  {text}
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
}

export default App;
