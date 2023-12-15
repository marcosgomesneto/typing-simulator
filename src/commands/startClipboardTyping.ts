import * as vscode from "vscode";
import { typing } from "../typing";
import Controller from "../Controller";

const startClipboardTyping = async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const controller = Controller.getInstance();
  const clipboardText = await vscode.env.clipboard.readText();
  controller.startTyping(clipboardText);
};

export default startClipboardTyping;
