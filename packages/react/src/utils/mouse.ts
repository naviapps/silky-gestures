import { MOUSE_BUTTONS, MouseButton } from '@/constants/mouse';
import { RockerDirection, WheelDirection } from '@/types';

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
