import { BrowserWindow } from 'electron';
import { Point } from '@nut-tree/shared';

export interface IWindow {
  init(point?: Point): void;
  getWindow(): BrowserWindow;
}
