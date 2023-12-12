import { stat } from "fs";
import * as vscode from "vscode";
import { state } from "./state";
import startCurrentFileTyping from "./commands/startCurrentFileTyping";
import { typing, manualTyping } from "./typing";

export function activate(context: vscode.ExtensionContext) {
  context.workspaceState.update("typingSimulator.status", "standby");

  let startTyping = vscode.commands.registerCommand(
    "typing-simulator.startCurrentFileTyping",
    startCurrentFileTyping,
  );

  let continueTyping = vscode.commands.registerCommand("typing-simulator.continueTyping", () => {
    typing({
      text: state.currentTypingText,
      pos: state.lastPosition,
    });
  });

  let stopTyping = vscode.commands.registerCommand("typing-simulator.stopTyping", () => {
    state.status = "stoped";
    state.currentTypingText = "";
  });

  let type = vscode.commands.registerCommand("type", manualTyping);

  context.subscriptions.push(startTyping, continueTyping, stopTyping, type);
}

export function deactivate() {}
