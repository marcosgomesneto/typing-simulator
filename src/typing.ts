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
  const eol = vscode.window.activeTextEditor?.document.eol == vscode.EndOfLine.LF ? "LF" : "CRLF";

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor");
    return;
  }

  const textAction = applyActions(text, pos);

  if (!textAction) {
    return;
  }
  text = textAction;

  var char = text.substring(0, 1);
  var charLength = 1;

  editor
    .edit(function (editBuilder) {
      editBuilder.insert(pos, char);
      if ((eol == "LF" && char == "\n") || (eol == "CRLF" && text.substring(0, 2) == "\r\n")) {
        if (eol == "CRLF") charLength = 2;
        pos = new vscode.Position(pos.line + 1, 0);
        char = "";
      }
    })
    .then(() => {
      const nextText = text.substring(charLength, text.length);
      state.currentTypingText = nextText;
      const selPos = new vscode.Position(pos.line, pos.character + 1);
      vscode.window.activeTextEditor!.selection = new vscode.Selection(selPos, selPos);
      const newPos = new vscode.Position(pos.line, char.length + pos.character);
      state.lastPosition = newPos;
      if (state.mode == "auto") delayTyping(nextText, newPos);
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

function applyActions(text: string, pos: vscode.Position): string | null {
  const endOfLinePos = text.indexOf("\n");
  const currentLine = text.substring(0, endOfLinePos);

  console.log("NEXT: " + currentLine);

  if (currentLine.match(/\/\/\[ignore-line\]/)) {
    console.log("ignore");
    text = text.substring(endOfLinePos + 1, text.length);
    const newPos = new vscode.Position(pos.line, 0);
    delayTyping(text, newPos);
    return null;
  }

  if (currentLine.match(/^\/\/\[pause\]/)) {
    console.log("pause");
    state.status = "paused";
    text = text.substring(endOfLinePos, text.length);
    state.currentTypingText = text;
    state.lastPosition = pos;
    return null;
  }

  return text;
}

export { typing, manualTyping, applyActions, delayTyping };
