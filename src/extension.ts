import * as vscode from "vscode";
import * as commands from "./commands/load";

export function activate(context: vscode.ExtensionContext) {
  let type: vscode.Disposable | null = null;

  const registerManualType = () => {
    if (type) return;
    type = vscode.commands.registerCommand("type", commands.manualTyping);
    context.subscriptions.push(type);
  };

  const startTypingFromFile = vscode.commands.registerCommand(
    "typing-simulator.startCurrentFileTyping",
    () => {
      registerManualType();
      commands.startCurrentFileTyping();
    },
  );

  const startTypingFromClipboard = vscode.commands.registerCommand(
    "typing-simulator.startClipboardTyping",
    () => {
      registerManualType();
      commands.startClipboardTyping();
    },
  );

  const continueTyping = vscode.commands.registerCommand(
    "typing-simulator.continueTyping",
    commands.continueTyping,
  );

  const stopTyping = vscode.commands.registerCommand("typing-simulator.stopTyping", () => {
    commands.stopTyping();
    type?.dispose();
    type = null;
  });

  context.subscriptions.push(
    startTypingFromFile,
    startTypingFromClipboard,
    continueTyping,
    stopTyping,
  );
}

export function deactivate() {}
