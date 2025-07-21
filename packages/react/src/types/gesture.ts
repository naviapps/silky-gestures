export type Point = { x: number; y: number };

export type LineDirection = 'U' | 'R' | 'D' | 'L' | '1' | '3' | '7' | '9';

export type ValidGestures = {
  U?: ValidGestures;
  R?: ValidGestures;
  D?: ValidGestures;
  L?: ValidGestures;
  '1'?: ValidGestures;
  '3'?: ValidGestures;
  '7'?: ValidGestures;
  '9'?: ValidGestures;
};
