import { LineDirection } from '@/types/gesture';

export const isLineDirection = (direction: string): direction is LineDirection =>
  ['U', 'R', 'D', 'L', '1', '3', '7', '9'].includes(direction);
