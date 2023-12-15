import * as vscode from "vscode";
import { state } from "../state";
import { typing } from "../typing";

const startClipboardTyping = async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  state.loadConfigurations();
  const clipboardText = await vscode.env.clipboard.readText();

  state.status = "typing";
  state.eol = vscode.window.activeTextEditor?.document.eol == vscode.EndOfLine.LF ? "lf" : "crlf";

  if (state.mode == "auto")
    typing({
      text: clipboardText,
    });
};

export default startClipboardTyping;
