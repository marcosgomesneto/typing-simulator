import * as vscode from "vscode";
import * as commands from "./commands/load";

export function activate(context: vscode.ExtensionContext) {
  const manualTyping = vscode.commands.registerCommand("type", commands.manualTyping);

  const startTypingFromFile = vscode.commands.registerCommand(
    "typing-simulator.startCurrentFileTyping",
    () => {
      commands.startCurrentFileTyping();
    },
  );

  const startTypingFromClipboard = vscode.commands.registerCommand(
    "typing-simulator.startClipboardTyping",
    () => {
      commands.startClipboardTyping();
    },
  );

  const continueTyping = vscode.commands.registerCommand(
    "typing-simulator.continueTyping",
    commands.continueTyping,
  );

  const stopTyping = vscode.commands.registerCommand("typing-simulator.stopTyping", () => {
    commands.stopTyping();
  });

  context.subscriptions.push(
    manualTyping,
    startTypingFromFile,
    startTypingFromClipboard,
    continueTyping,
    stopTyping,
  );
}

export function deactivate() {}
