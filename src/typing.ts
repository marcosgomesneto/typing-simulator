import * as vscode from "vscode";
import { state } from "./state";
import Queue from "promise-queue";

interface TypingProps {
  text: string;
  pos?: vscode.Position;
}

const typingConcurrency = 1;
const typingQueueMaxSize = Number.MAX_SAFE_INTEGER;
const typingQueue = new Queue(typingConcurrency, typingQueueMaxSize);

async function typing(props: TypingProps): Promise<void> {
  if (!props.text || props.text.length == 0 || state.status == "stoped") return;
  var text = props.text;
  var pos = props.pos ?? new vscode.Position(0, 0);
  const eol = state.eol;

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor");
    return;
  }

  const textAction = applyActions(text, pos);

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
  state.currentTypingText = nextText;
  const selPos = new vscode.Position(pos.line, pos.character + 1);
  vscode.window.activeTextEditor!.selection = new vscode.Selection(selPos, selPos);
  const newPos = new vscode.Position(pos.line, char.length + pos.character);
  state.lastPosition = newPos;
  nextBuffer(nextText, newPos);
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

function manualTyping({ text }: { text: string }) {
  if (state.status == "typing" && state.mode == "manual") {
    typingQueue.add(() => {
      return typing({
        text: state.currentTypingText,
        pos: state.lastPosition,
      });
    });
  } else if (state.status == "paused" && state.mode == "manual") {
    if (text == "\n") {
      state.status = "typing";
    }
    //waiting enter
  } else {
    vscode.commands.executeCommand("default:type", { text });
  }
}

function delayTyping(text: string, pos: vscode.Position) {
  let delay = 20 + 80 * Math.random();
  if (Math.random() < 0.1) delay += 250;

  setTimeout(function () {
    typing({
      text: text,
      pos: pos,
    });
  }, delay);
}

function nextBuffer(text: string, pos: vscode.Position) {
  if (state.status == "typing" && state.mode == "auto") {
    delayTyping(text, pos);
  }
}

function applyActions(text: string, pos: vscode.Position): string | null {
  const eolChar = state.eol == "lf" ? "\n" : "\r\n";
  const eolLength = eolChar.length;
  const endOfLinePos = text.indexOf(eolChar);
  const currentLine = text.split(eolChar)[0];

  console.log("NEXT: " + currentLine);

  if (currentLine.trim().match(/\/\/\[ignore\]/)) {
    text = text.substring(currentLine.length + eolLength, text.length);
    const newPos = new vscode.Position(pos.line, 0);
    nextBuffer(text, newPos);
    return null;
  }

  if (currentLine.trim().match(/\/\/\[quick\]/)) {
    writeText(currentLine, new vscode.Position(pos.line, 0));
    text = text.substring(endOfLinePos, text.length);
    const newPos = new vscode.Position(pos.line + 1, 0);
    nextBuffer(text, newPos);
    return null;
  }

  const alone = Boolean(currentLine.trim().match(/^\s*\/\/\[pause\]\s*/) && pos.character == 0);
  if (currentLine.trim().match(/^\/\/\[pause\]/) || alone) {
    state.status = "paused";
    text = text.substring(alone ? currentLine.length + eolLength : endOfLinePos, text.length);
    state.currentTypingText = text;
    state.lastPosition = pos;
    return null;
  }

  return text;
}

export { typing, manualTyping, applyActions, delayTyping };
