import * as vscode from "vscode";

export const getActiveEditor = () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("Typing Simulator: I did not find an open and active file.");
    return;
  }

  return editor;
};
