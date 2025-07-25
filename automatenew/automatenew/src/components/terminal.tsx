import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

const TerminalComponent = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const inputBuffer = useRef<string>("");

  useEffect(() => {
    if (terminalRef.current && !term.current) {
      const terminal = new Terminal({
        cursorBlink: true,
        theme: {
          foreground: "#ffffff",
          background: "#000000",
        },
      });

      terminal.open(terminalRef.current);
      terminal.write("Welcome to the simulated terminal!\r\n$ ");

      terminal.onData((data) => {
        const code = data.charCodeAt(0);

        switch (code) {
          case 13: // Enter
            terminal.write("\r\nYou typed: " + inputBuffer.current + "\r\n$ ");
            inputBuffer.current = "";
            break;
          case 127: // Backspace
            if (inputBuffer.current.length > 0) {
              inputBuffer.current = inputBuffer.current.slice(0, -1);
              terminal.write("\b \b");
            }
            break;
          default:
            // Only allow printable characters
            if (code >= 32 && code <= 126) {
              inputBuffer.current += data;
              terminal.write(data);
            }
            break;
        }
      });

      term.current = terminal;
    }
  }, []);

  return (
    <div
      ref={terminalRef}
      style={{
        width: "100%",
        height: "40%",
        border: "1px solid #fff",
        backgroundColor: "#000",
        padding: 10,
        overflow: "auto",
        borderRadius: "8px",
      }}
    />
  );
};

export default TerminalComponent;
