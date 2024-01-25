import * as vscode from "vscode";
import { Mode, Speed, State } from "./State";
import { typing } from "./typing";
import Queue from "promise-queue";

class Controller {
  private static instance: Controller;
  private state: State;
  private typingConcurrency = 1;
  private typingQueueMaxSize = Number.MAX_SAFE_INTEGER;
  private typingQueue: Queue;

  private constructor() {
    this.state = new State();
    this.typingQueue = new Queue(this.typingConcurrency, this.typingQueueMaxSize);
  }

  public static getInstance(): Controller {
    if (!Controller.instance) {
      Controller.instance = new Controller();
    }
    return Controller.instance;
  }

  public startTyping(text: string, document: vscode.TextDocument, position?: vscode.Position) {
    vscode.workspace.onDidCloseTextDocument((document: vscode.TextDocument) => {
      if (document.uri != this.state.currentDocument) return;
      this.state.setStatus("stoped");
      vscode.window.showInformationMessage(
        "Typing Simulator: I stopped the simulator because you closed the file.",
      );
      return;
    });

    this.state.setCurrentDocument(document.uri);
    this.loadConfigurations();
    this.state.setTypingText(text);
    const docEol = document.eol ?? vscode.EndOfLine.LF;
    this.state.eol = docEol == vscode.EndOfLine.LF ? "lf" : "crlf";
    this.state.setStatus("typing");
    if (this.state.mode == "auto") {
      typing({ text: text, state: this.state, pos: position ?? new vscode.Position(0, 0) });
    }
    if (this.state.mode == "manual") {
      this.state.setPosition(position ?? new vscode.Position(0, 0));
    }
  }

  public continueTyping() {
    if (this.state.status == "standby") {
      vscode.window.showErrorMessage("Typing Simulator: You need to start typing.");
      return;
    }
    this.loadConfigurations();
    this.state.setStatus("typing");
    typing({
      text: this.state.typingText,
      pos: this.state.position,
      state: this.state,
    });
  }

  public stopTyping() {
    this.state.setStatus("standby");
  }

  public bindKeys(text: string) {
    if (this.state.status == "typing" && this.state.mode == "manual") {
      this.typingQueue.add(() => {
        return typing({
          text: this.state.typingText,
          pos: this.state.position,
          state: this.state,
        });
      });
    } else if (this.state.status == "paused" && this.state.mode == "manual") {
      vscode.commands.executeCommand("default:type", { text });
      if (text == "\n") {
        this.state.setStatus("typing");
      }
      //waiting enter
    } else {
      vscode.commands.executeCommand("default:type", { text });
    }
  }

  private loadConfigurations() {
    const config = vscode.workspace.getConfiguration("typingSimulator");
    this.state.setMode(config.get<Mode>("mode") ?? "auto");
    this.state.setSpeed(config.get<Speed>("speed") ?? "medium");
  }
}

export default Controller;
