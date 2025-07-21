import { ComponentPropsWithoutRef, JSX, useEffect, useRef } from 'react';

type LineProperties = ComponentPropsWithoutRef<'canvas'> & {
  gesture: string;
  width: number;
  height: number;
  trailColor?: string;
  trailWidth?: number;
};

export function Line({ gesture, width, height, trailColor, trailWidth = 3, ...rest }: LineProperties): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) {
      return;
    }
    const context = c.getContext('2d');
    if (!context) {
      return;
    }
    if (trailColor) {
      context.strokeStyle = trailColor;
    }
    context.lineWidth = trailWidth;
    context.lineCap = 'butt';
    let step = 10;
    let tight = 2;
    let separator = 3;

    let previous = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    const max = { x: 0, y: 0 };
    const min = { x: 0, y: 0 };

    const minmax = (): void => {
      if (max.x < current.x) {
        max.x = current.x;
      }
      if (max.y < current.y) {
        max.y = current.y;
      }
      if (current.x < min.x) {
        min.x = current.x;
      }
      if (current.y < min.y) {
        min.y = current.y;
      }
    };
    const tip = (direction: string): void => {
      previous = current;
      context.lineTo(previous.x, previous.y);
      switch (direction) {
        case 'U': {
          current = { x: previous.x, y: previous.y - step * 0.75 };
          break;
        }
        case 'D': {
          current = { x: previous.x, y: previous.y + step * 0.75 };
          break;
        }
        case 'L': {
          current = { x: previous.x - step * 0.75, y: previous.y };
          break;
        }
        case 'R': {
          current = { x: previous.x + step * 0.75, y: previous.y };
          break;
        }
        case '1': {
          current = { x: previous.x - step * 0.5, y: previous.y + step * 0.5 };
          break;
        }
        case '3': {
          current = { x: previous.x + step * 0.5, y: previous.y + step * 0.5 };
          break;
        }
        case '7': {
          current = { x: previous.x - step * 0.5, y: previous.y - step * 0.5 };
          break;
        }
        case '9': {
          current = { x: previous.x + step * 0.5, y: previous.y - step * 0.5 };
          break;
        }
        // No default
      }
      context.lineTo(current.x, current.y);
      minmax();
    };
    const curve = (direction: string): void => {
      previous = current;
      context.lineTo(previous.x, previous.y);
      switch (direction) {
        case 'UD': {
          current = { x: previous.x, y: previous.y - step };
          minmax();
          context.lineTo(previous.x, previous.y - step);
          context.arc(previous.x + tight, previous.y - step, tight, Math.PI, 0, false);
          context.lineTo(previous.x + tight * 2, previous.y);
          break;
        }
        case 'UL': {
          context.arc(previous.x - step, previous.y, step, 0, -Math.PI / 2, true);
          break;
        }
        case 'UR': {
          context.arc(previous.x + step, previous.y, step, Math.PI, -Math.PI / 2, false);
          break;
        }
        case 'DU': {
          current = { x: previous.x, y: previous.y + step };
          minmax();
          context.lineTo(previous.x, previous.y + step);
          context.arc(previous.x + tight, previous.y + step, tight, Math.PI, 0, true);
          context.lineTo(previous.x + tight * 2, previous.y);
          break;
        }
        case 'DL': {
          context.arc(previous.x - step, previous.y, step, 0, Math.PI / 2, false);
          break;
        }
        case 'DR': {
          context.arc(previous.x + step, previous.y, step, Math.PI, Math.PI / 2, true);
          break;
        }
        case 'LU': {
          context.arc(previous.x, previous.y - step, step, Math.PI / 2, Math.PI, false);
          break;
        }
        case 'LD': {
          context.arc(previous.x, previous.y + step, step, -Math.PI / 2, Math.PI, true);
          break;
        }
        case 'LR': {
          current = { x: previous.x - step, y: previous.y };
          minmax();
          context.lineTo(previous.x - step, previous.y);
          context.arc(previous.x - step, previous.y + tight, tight, -Math.PI / 2, Math.PI / 2, true);
          context.lineTo(previous.x, previous.y + tight * 2);
          break;
        }
        case 'RU': {
          context.arc(previous.x, previous.y - step, step, Math.PI / 2, 0, true);
          break;
        }
        case 'RD': {
          context.arc(previous.x, previous.y + step, step, -Math.PI / 2, 0, false);
          break;
        }
        case 'RL': {
          current = { x: previous.x + step, y: previous.y };
          minmax();
          context.lineTo(previous.x + step, previous.y);
          context.arc(previous.x + step, previous.y + tight, tight, -Math.PI / 2, Math.PI / 2, false);
          context.lineTo(previous.x, previous.y + tight * 2);
          break;
        }
        default: {
          tip(direction[0]);
          tip(direction[1]);
        }
      }
      switch (direction) {
        case 'UD': {
          current = { x: previous.x + tight * 2, y: previous.y + separator };
          break;
        }
        case 'UL': {
          current = { x: previous.x - step, y: previous.y - step };
          break;
        }
        case 'UR': {
          current = { x: previous.x + step + separator, y: previous.y - step };
          break;
        }
        case 'DU': {
          current = { x: previous.x + tight * 2, y: previous.y };
          break;
        }
        case 'DL': {
          current = { x: previous.x - step, y: previous.y + step };
          break;
        }
        case 'DR': {
          current = { x: previous.x + step + separator, y: previous.y + step };
          break;
        }
        case 'LU': {
          current = { x: previous.x - step, y: previous.y - step };
          break;
        }
        case 'LD': {
          current = { x: previous.x - step, y: previous.y + step + separator };
          break;
        }
        case 'LR': {
          current = { x: previous.x + separator, y: previous.y + tight * 2 };
          break;
        }
        case 'RU': {
          current = { x: previous.x + step, y: previous.y - step };
          break;
        }
        case 'RD': {
          current = { x: previous.x + step, y: previous.y + step + separator };
          break;
        }
        case 'RL': {
          current = { x: previous.x, y: previous.y + tight * 2 };
          break;
        }
        // No default
      }
      minmax();
    };

    context.beginPath();
    tip(gesture[0]);
    for (let index = 0; index < gesture.length - 1; index += 1) {
      curve(gesture[index] + gesture[index + 1]);
    }
    tip(gesture.at(-1)!);
    context.stroke();

    const center = { x: (max.x + min.x) / 2, y: (max.y + min.y) / 2 };
    const wr = (max.x - min.x + step) / width;
    const hr = (max.y - min.y + step) / height;
    const ratio = Math.max(wr, hr);
    step /= ratio;
    separator /= ratio;
    tight /= ratio;
    if (tight > 6) {
      tight = 6;
    }
    current = { x: 0, y: 0 };

    context.clearRect(0, 0, c.width, c.height);
    context.save();
    context.translate(width / 2 - center.x / ratio, height / 2 - center.y / ratio);
    context.beginPath();
    tip(gesture[0]);
    for (let index = 0; index < gesture.length - 1; index += 1) {
      curve(gesture[index] + gesture[index + 1]);
    }
    tip(gesture.at(-1)!);
    context.stroke();
    if (trailColor) {
      context.fillStyle = trailColor;
    }
    context.beginPath();
    if (gesture.at(-1) === 'U') {
      context.moveTo(current.x - 5, current.y + 2);
      context.lineTo(current.x + 5, current.y + 2);
      context.lineTo(current.x, current.y - 3);
    } else if (gesture.at(-1) === 'D') {
      context.moveTo(current.x - 5, current.y - 2);
      context.lineTo(current.x + 5, current.y - 2);
      context.lineTo(current.x, current.y + 3);
    } else if (gesture.at(-1) === 'L') {
      context.moveTo(current.x + 2, current.y - 5);
      context.lineTo(current.x + 2, current.y + 5);
      context.lineTo(current.x - 3, current.y);
    } else if (gesture.at(-1) === 'R') {
      context.moveTo(current.x - 2, current.y - 5);
      context.lineTo(current.x - 2, current.y + 5);
      context.lineTo(current.x + 3, current.y);
    } else if (gesture.at(-1) === '1') {
      context.moveTo(current.x - 2, current.y - 6);
      context.lineTo(current.x + 6, current.y + 2);
      context.lineTo(current.x - 2, current.y + 2);
    } else if (gesture.at(-1) === '3') {
      context.moveTo(current.x + 2, current.y - 6);
      context.lineTo(current.x - 6, current.y + 2);
      context.lineTo(current.x + 2, current.y + 2);
    } else if (gesture.at(-1) === '7') {
      context.moveTo(current.x - 2, current.y + 6);
      context.lineTo(current.x + 6, current.y - 2);
      context.lineTo(current.x - 2, current.y - 2);
    } else if (gesture.at(-1) === '9') {
      context.moveTo(current.x + 2, current.y + 6);
      context.lineTo(current.x - 6, current.y - 2);
      context.lineTo(current.x + 2, current.y - 2);
    }
    context.closePath();
    context.fill();
    context.restore();
  }, [gesture, width, height, trailColor, trailWidth]);

  return <canvas ref={canvasRef} width={width} height={height} {...rest} />;
}
