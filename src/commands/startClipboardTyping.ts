import * as vscode from "vscode";
import Controller from "../Controller";
import { getActiveEditor } from "../utils/editor";

const startClipboardTyping = async () => {
  const editor = getActiveEditor();
  if (!editor) return;

  const controller = Controller.getInstance();
  const clipboardText = await vscode.env.clipboard.readText();
  if (!clipboardText.trim()) {
    vscode.window.showErrorMessage("Typing Simulator: I did not find any text in the clipboard.");
    return;
  }

  controller.startTyping(clipboardText, editor.document, editor.selection.active);
};

export default startClipboardTyping;
