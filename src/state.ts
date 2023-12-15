import * as vscode from "vscode";
export type Status = "standby" | "typing" | "stoped" | "paused";
export type Mode = "auto" | "manual";
export type EOL = "lf" | "crlf";
export type Speed = "slow" | "medium" | "fast";

export class State {
  private _status: Status;
  private _typingText: string;
  private _position: vscode.Position;
  private _mode: Mode = "auto";
  private _speed: Speed = "medium";
  private _eol: EOL;

  constructor() {
    this._eol = "crlf";
    this._status = "standby";
    this._typingText = "";
    this._position = new vscode.Position(0, 0);
  }

  get status() {
    return this._status;
  }

  setStatus(value: Status) {
    this._status = value;
  }

  get typingText() {
    return this._typingText;
  }

  setTypingText(value: string) {
    this._typingText = value;
  }

  get position() {
    return this._position;
  }

  setPosition(value: vscode.Position) {
    this._position = value;
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
