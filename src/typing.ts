import * as vscode from "vscode";
import { EOL, State, Status } from "./State";

interface TypingProps {
  text: string;
  state: State;
  pos?: vscode.Position;
}

async function typing(props: TypingProps): Promise<void> {
  if (!props.text || props.text.length == 0 || props.state.status != "typing") return;
  var text = props.text;
  var pos = props.pos ?? new vscode.Position(0, 0);
  const eol = props.state.eol;

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor");
    return;
  }

  const textAction = applyActions(text, pos, props.state);

  if (!textAction) return;

  text = textAction;

  var char = text.substring(0, 1);
  var charLength = 1;

  await writeText(char, pos);

  if ((eol == "lf" && char == "\n") || (eol == "crlf" && text.substring(0, 2) == "\r\n")) {
    if (eol == "crlf") charLength = 2;
    pos = new vscode.Position(pos.line + 1, 0);
    char = "";
  }

  const nextText = text.substring(charLength, text.length);
  props.state.setTypingText(nextText);
  const selPos = new vscode.Position(pos.line, pos.character + 1);
  vscode.window.activeTextEditor!.selection = new vscode.Selection(selPos, selPos);
  const newPos = new vscode.Position(pos.line, char.length + pos.character);
  props.state.setPosition(newPos);
  nextBuffer(nextText, newPos, props.state);
}

async function writeText(text: string, pos: vscode.Position) {
  return new Promise<void>((resolve, reject) => {
    try {
      const editor = vscode.window.activeTextEditor;
      if (!editor) throw new Error("No active editor");
      editor
        .edit(function (editBuilder) {
          editBuilder.insert(pos, text);
        })
        .then(
          () => {
            resolve();
          },
          () => {
            throw new Error("Error on write text");
          },
        );
    } catch (e) {
      reject();
    }
  });
}

function delayTyping(text: string, pos: vscode.Position, state: State) {
  let delay = 20 + 80 * Math.random();
  if (Math.random() < 0.1) delay += 250;

  setTimeout(function () {
    typing({
      text: text,
      pos: pos,
      state,
    });
  }, delay);
}

function nextBuffer(text: string, pos: vscode.Position, state: State) {
  if (state.status == "typing" && state.mode == "auto") {
    delayTyping(text, pos, state);
  }
}

function applyActions(text: string, pos: vscode.Position, state: State): string | null {
  const eolChar = state.eol == "lf" ? "\n" : "\r\n";
  const eolLength = eolChar.length;
  const endOfLinePos = text.indexOf(eolChar);
  const currentLine = text.split(eolChar)[0];

  console.log("NEXT: " + currentLine);

  if (currentLine.trim().match(/\/\/\[ignore\]/)) {
    text = text.substring(currentLine.length + eolLength, text.length);
    const newPos = new vscode.Position(pos.line, 0);
    nextBuffer(text, newPos, state);
    return null;
  }

  if (currentLine.trim().match(/\/\/\[quick\]/)) {
    writeText(currentLine, new vscode.Position(pos.line, 0));
    text = text.substring(endOfLinePos, text.length);
    const newPos = new vscode.Position(pos.line + 1, 0);
    nextBuffer(text, newPos, state);
    return null;
  }

  const alone = Boolean(currentLine.trim().match(/^\s*\/\/\[pause\]\s*/) && pos.character == 0);
  if (currentLine.trim().match(/^\/\/\[pause\]/) || alone) {
    state.setStatus("paused");
    text = text.substring(alone ? currentLine.length + eolLength : endOfLinePos, text.length);
    state.setTypingText(text);
    state.setPosition(pos);
    return null;
  }

  return text;
}

export { typing, applyActions, delayTyping };
