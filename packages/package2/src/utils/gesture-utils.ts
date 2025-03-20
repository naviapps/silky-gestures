import {
  ValidGestures,
  RockerDirection,
  WheelDirection,
} from '@/types/gesture';

import {
  isLineDirection,
  isRockerDirection,
  isWheelDirection,
} from '@/utilities';

//

// TODO
export const LINE_PREFIXES = ['l', 'i', 's'] as const;

// TODO
function buildKeyboardGestureNode(gesture: string, tree: ValidGestures): void {
  const [, mask, key] = gesture.slice(1).split(':', 3);
  if (!mask || !key) return;

  tree.k ??= {};
  tree.k[mask] ??= [];
  tree.k[mask].push(key);
}

function buildRockerGestureNode(gesture: string, tree: ValidGestures): void {
  const directions = gesture.slice(1);
  tree.r ??= {};

  let node = tree.r as Record<RockerDirection, ValidGestures>;
  for (const direction of directions) {
    if (!isRockerDirection(direction)) continue;
    node[direction] ??= {};
    node = node[direction] as Record<RockerDirection, ValidGestures>;
  }
}

function buildWheelGestureNode(gesture: string, tree: ValidGestures): void {
  const directions = gesture.slice(1);
  tree.w ??= {};

  let node = tree.w as Record<WheelDirection, ValidGestures>;
  for (const direction of directions) {
    if (!isWheelDirection(direction)) continue;
    node[direction] ??= {};
    node = node[direction] as Record<WheelDirection, ValidGestures>;
  }
}

function buildLineGestureNode(gesture: string, tree: ValidGestures): void {
  const prefix = gesture.charAt(0);
  const isLinePrefix = (LINE_PREFIXES as readonly string[]).includes(prefix);
  const sequence = isLinePrefix ? gesture.slice(1) : gesture;

  let node: ValidGestures = tree;
  for (const direction of sequence) {
    if (!isLineDirection(direction)) continue;
    node[direction] ??= {};
    node = node[direction];
  }
}

export function buildValidGestures(gestures: string[]): ValidGestures {
  const tree: ValidGestures = {};

  for (const gesture of gestures) {
    if (!gesture || gesture.length === 0) continue;

    const prefix = gesture.charAt(0);

    switch (prefix) {
      case 'k': {
        buildKeyboardGestureNode(gesture, tree);
        break;
      }
      case 'r': {
        buildRockerGestureNode(gesture, tree);
        break;
      }
      case 'w': {
        buildWheelGestureNode(gesture, tree);
        break;
      }
      default: {
        buildLineGestureNode(gesture, tree);
        break;
      }
    }
  }

  return tree;
}

// TODO
