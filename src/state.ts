import * as vscode from "vscode";
type Status = "standby" | "typing" | "stoped" | "paused";
type Mode = "auto" | "manual";
type EOL = "lf" | "crlf";

class State {
  private _status: Status = "standby";
  private _currentTypingText: string = "";
  private _lastPosition = new vscode.Position(0, 0);
  private _mode: Mode = "auto";
  private _eol: EOL = "crlf";

  get status() {
    return this._status;
  }

  set status(value: Status) {
    this._status = value;
  }

  get currentTypingText() {
    return this._currentTypingText;
  }

  set currentTypingText(value: string) {
    this._currentTypingText = value;
  }

  get lastPosition() {
    return this._lastPosition;
  }

  set lastPosition(value: vscode.Position) {
    this._lastPosition = value;
  }

  get mode() {
    return this._mode;
  }

  set mode(value: Mode) {
    this._mode = value;
  }

  get eol() {
    return this._eol;
  }

  set eol(value: EOL) {
    this._eol = value;
  }
}

export const state = new State();
