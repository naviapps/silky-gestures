export type Point = { x: number; y: number };

export type LineDirection = 'U' | 'R' | 'D' | 'L' | '1' | '3' | '7' | '9';
export type RockerDirection = 'L' | 'M' | 'R';
export type WheelDirection = 'U' | 'D';

export type ValidLineGestures = {
  U?: ValidLineGestures;
  R?: ValidLineGestures;
  D?: ValidLineGestures;
  L?: ValidLineGestures;
  '1'?: ValidLineGestures;
  '3'?: ValidLineGestures;
  '7'?: ValidLineGestures;
  '9'?: ValidLineGestures;
};

export type ValidRockerGestures = {
  L?: ValidRockerGestures;
  M?: ValidRockerGestures;
  R?: ValidRockerGestures;
};

export type ValidWheelGestures = {
  U?: ValidWheelGestures;
  D?: ValidWheelGestures;
};

export type ValidKeyGestures = Record<string, string[]>;
