import { LineDirection, Point, RockerDirection, WheelDirection } from '@/types';

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

export const isLineDirection = (
  direction: string,
): direction is LineDirection =>
  ['U', 'R', 'D', 'L', '1', '3', '7', '9'].includes(direction);

export const isRockerDirection = (
  direction: string,
): direction is RockerDirection => ['L', 'M', 'R'].includes(direction);

export const isWheelDirection = (
  direction: string,
): direction is WheelDirection => ['U', 'D'].includes(direction);
