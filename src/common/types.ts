import { BrowserWindow } from 'electron';

export interface ICreateWindowOption {
  x?: number;
  y?: number;
  value?: string;
  plugin?: string;
}

export abstract class IBrowserWindow {
  abstract getWindow(): BrowserWindow;
  abstract init(option?: ICreateWindowOption): void;
}
