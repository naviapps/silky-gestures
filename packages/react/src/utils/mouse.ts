import { MOUSE_BUTTONS, MouseButton } from '@/constants';
import { LineDirection, Point, RockerDirection, WheelDirection } from '@/types';

export function isOverScrollbar(event: MouseEvent): boolean {
  const { clientX, clientY } = event;
  const docCW = document.documentElement.clientWidth;
  const docCH = document.documentElement.clientHeight;

  const scrollbarWidth = window.innerWidth - docCW;
  const scrollbarHeight = window.innerHeight - docCH;

  const overVerticalScrollbar = scrollbarWidth > 0 && clientX >= docCW;
  const overHorizontalScrollbar = scrollbarHeight > 0 && clientY >= docCH;

  return overVerticalScrollbar || overHorizontalScrollbar;
}

export function determineWheelDirection(deltaY: number): WheelDirection {
  return deltaY < 0 ? 'U' : 'D';
}

const BUTTON_TO_ROCKER: Readonly<Record<MouseButton, RockerDirection>> = {
  [MouseButton.Left]: 'L',
  [MouseButton.Middle]: 'M',
  [MouseButton.Right]: 'R',
};

export function getRockerDirections(
  buttons: Record<MouseButton, boolean>,
): [RockerDirection, RockerDirection] | null {
  const pressedButtons = MOUSE_BUTTONS.filter((btn) => buttons[btn]);

  if (pressedButtons.length !== 2) return null;
  return [
    BUTTON_TO_ROCKER[pressedButtons[0]],
    BUTTON_TO_ROCKER[pressedButtons[1]],
  ];
}

const DIRECTION_RATIO = 2;

export function determineLineDirection(from: Point, to: Point): LineDirection {
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (absX > DIRECTION_RATIO * absY) {
    return deltaX > 0 ? 'R' : 'L';
  }

  if (absY > DIRECTION_RATIO * absX) {
    return deltaY > 0 ? 'D' : 'U';
  }

  const isDiagonalUp = deltaY < 0;
  return deltaX > 0 ? (isDiagonalUp ? '9' : '3') : isDiagonalUp ? '7' : '1';
}

const LINUX_MENU_OFFSET = 55;

export function getContextMenuPosition(
  screenX: number,
  screenY: number,
  pointerClientX: number,
  pointerClientY: number,
): Point {
  const isLinux = /linux/i.test(navigator.userAgent);
  if (!isLinux) {
    return { x: screenX, y: screenY };
  }

  const windowLeft = window.screenLeft ?? window.screenX;
  const windowTop = window.screenTop ?? window.screenY;
  const pixelRatio = window.devicePixelRatio;

  const minScreenX = windowLeft + Math.round(pointerClientX * pixelRatio);
  const minScreenY =
    windowTop + LINUX_MENU_OFFSET + Math.round(pointerClientY * pixelRatio);

  return {
    x: screenX < minScreenX ? screenX + windowLeft : screenX,
    y: screenY < minScreenY ? screenY + windowTop : screenY,
  };
}
