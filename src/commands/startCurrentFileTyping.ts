import * as vscode from "vscode";
import Controller from "../Controller";
import { getActiveEditor } from "../utils/editor";

const startCurrentFileTyping = () => {
  const editor = getActiveEditor();
  if (!editor) return;

  const document = editor.document;

  const textContent = document.getText();
  if (!textContent.trim()) {
    vscode.window.showErrorMessage(
      "Typing Simulator: I did not find any text in the current file.",
    );
    return;
  }

  const controller = Controller.getInstance();

  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(document.getText().length),
  );
  const edit = new vscode.WorkspaceEdit();

  edit.delete(document.uri, fullRange);
  vscode.workspace.applyEdit(edit).then(() => {
    controller.startTyping(textContent, document);
  });
};

export default startCurrentFileTyping;
