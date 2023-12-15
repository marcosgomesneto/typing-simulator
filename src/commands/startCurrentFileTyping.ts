import * as vscode from "vscode";
import Controller from "../Controller";

const startCurrentFileTyping = () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const controller = Controller.getInstance();
  const document = editor.document;
  const textContent = document.getText();
  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(document.getText().length),
  );
  const edit = new vscode.WorkspaceEdit();

  edit.delete(document.uri, fullRange);
  vscode.workspace.applyEdit(edit).then(() => {
    controller.startTyping(textContent);
  });
};

export default startCurrentFileTyping;
