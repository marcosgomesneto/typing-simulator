import * as vscode from "vscode";
import { state } from "../state";
import { typing } from "../typing";

const startCurrentFileTyping = () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  state.status = "typing";
  const document = editor.document;

  const textContent = document.getText();

  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(document.getText().length),
  );

  const edit = new vscode.WorkspaceEdit();
  edit.delete(document.uri, fullRange);

  vscode.workspace.applyEdit(edit).then(() => {
    console.log("editing\n");
    state.currentTypingText = textContent;

    if (state.mode == "auto")
      typing({
        text: textContent,
      });
  });

  vscode.window.showInformationMessage(textContent);
};

export default startCurrentFileTyping;
