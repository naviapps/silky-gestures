import { LineDirection, Point } from '@/types';

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
  const minScreenY = windowTop + LINUX_MENU_OFFSET + Math.round(pointerClientY * pixelRatio);

  return {
    x: screenX < minScreenX ? screenX + windowLeft : screenX,
    y: screenY < minScreenY ? screenY + windowTop : screenY,
  };
}
