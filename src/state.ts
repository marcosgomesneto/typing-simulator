import * as vscode from "vscode";
type Status = "standby" | "typing" | "stoped" | "paused";
type Mode = "auto" | "manual";
type EOL = "lf" | "crlf";
type Speed = "slow" | "medium" | "fast";

class State {
  private _status: Status;
  private _currentTypingText: string;
  private _lastPosition: vscode.Position;
  private _mode: Mode = "auto";
  private _speed: Speed = "medium";
  private _eol: EOL;

  constructor() {
    this.loadConfigurations();
    this._eol = "crlf";
    this._status = "standby";
    this._currentTypingText = "";
    this._lastPosition = new vscode.Position(0, 0);
  }

  loadConfigurations() {
    const config = vscode.workspace.getConfiguration("typingSimulator");
    this._mode = config.get<Mode>("mode") ?? this._mode;
    this._speed = config.get<Speed>("speed") ?? this._speed;
  }

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

  get speed() {
    return this._speed;
  }

  set speed(value: Speed) {
    this._speed = value;
  }
}

export const state = new State();
