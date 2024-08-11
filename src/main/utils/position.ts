import { screen } from 'electron';
import {
  WINDOW_HEIGHT,
  WINDOW_PLUGIN_HEIGHT,
  WINDOW_WIDTH
} from '@config/constants';

export function getPosition() {
  const { x, y } = screen.getCursorScreenPoint();
  const currentDisplay = screen.getDisplayNearestPoint({ x, y });

  const _height = WINDOW_HEIGHT + WINDOW_PLUGIN_HEIGHT;

  const _x =
    currentDisplay.workArea.x +
    (currentDisplay.workArea.width - WINDOW_WIDTH) / 2;
  const _y =
    currentDisplay.workArea.y + (currentDisplay.workArea.height - _height) / 2;
  return {
    x: parseInt(String(_x)),
    y: parseInt(String(_y))
  };
}
