import { throttle } from 'es-toolkit';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Point, ValidGestures } from '@/types/gesture';
import { determineLineDirection, getContextMenuPosition, getLink } from '@/utils';

export type UseGesturesOptions = {
  validGestures?: ValidGestures;
  onRightClick?: (point: Point) => Promise<void>;
  onRefreshLine?: () => void;
  onGesture?: (message: GestureMessage) => Promise<void>;
};

type LineState = {
  code: string;
  points: Point[];
  dirPoints: Point[];
  possibleDirs?: ValidGestures;
};

type GestureState = {
  events: boolean;
  target?: EventTarget;
  selection?: string;
  line?: LineState;
};

type GestureMessage = {
  gesture: string;
  link?: string;
  image?: string;
  selection?: string;
};

export function useGestures(options: UseGesturesOptions = {}) {
  const { validGestures, onRightClick, onRefreshLine, onGesture } = options;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  // gesture states
  const gestureRef = useRef<GestureState>({
    events: false,
  });

  // mouse event states
  const buttonDownRef = useRef<boolean>(false);
  const blockClickRef = useRef<boolean>(false);
  const blockContextRef = useRef<boolean>(true);
  const forceContextRef = useRef<boolean>(false);

  /*
   * Start/End Gestures
   */
  const endGesture = useCallback((): void => {
    setIsOpen(false);
    gestureRef.current = {
      events: false,
    };
  }, []);

  const startGesture = useCallback(
    (point?: Point, target?: EventTarget): void => {
      endGesture();

      const sel = window.getSelection?.();
      const selection = sel?.toString();

      gestureRef.current = {
        events: true,
        target,
        selection,
        line: {
          code: '',
          points: point ? [point] : [],
          dirPoints: point ? [point] : [],
          possibleDirs: validGestures,
        },
      };
    },
    [endGesture, validGestures],
  );

  const sendGesture = useCallback(
    async (code: string): Promise<void> => {
      if (!code) return;

      const message: GestureMessage = {
        gesture: code,
        selection: gestureRef.current.selection,
      };

      if (gestureRef.current.target instanceof HTMLElement) {
        const element = gestureRef.current.target;
        const href = getLink(element);
        if (href) {
          message.link = href;
        }
        if (element instanceof HTMLImageElement) {
          message.image = element.src;
        }
      }

      await onGesture?.(message);

      endGesture();
    },
    [onGesture, endGesture],
  );

  const moveGesture = useCallback(
    (event: MouseEvent, diagonal: boolean = false): void => {
      if (!gestureRef.current.line) {
        return;
      }

      const next = { x: event.clientX, y: event.clientY };
      gestureRef.current.line.points.push(next);

      const lastPoint = gestureRef.current.line.dirPoints.at(-1)!;
      const diffx = next.x - lastPoint.x;
      const diffy = next.y - lastPoint.y;

      onRefreshLine?.();
      if (Math.max(Math.abs(diffx), Math.abs(diffy)) > 10) {
        setIsOpen(true);
      }

      const lastDirection = gestureRef.current.line.code.slice(-1) || 'X';
      const newDirection = determineLineDirection(lastPoint, next);

      if (newDirection === lastDirection) {
        gestureRef.current.line.dirPoints[gestureRef.current.line.dirPoints.length - 1] = next;
      } else if (Math.max(Math.abs(diffx), Math.abs(diffy)) > 25 && (diagonal || /^[RLUD]$/.test(newDirection))) {
        if (gestureRef.current.line.possibleDirs) {
          gestureRef.current.line.possibleDirs = gestureRef.current.line.possibleDirs[newDirection];
        }

        if (gestureRef.current.line.possibleDirs || !validGestures) {
          gestureRef.current.line.code += newDirection;
          gestureRef.current.line.dirPoints.push(next);
        } else {
          endGesture();
          blockContextRef.current = true;
        }
      }
    },
    [onRefreshLine, validGestures, endGesture],
  );

  /*
   * Page Events
   */
  const handleMouseDown = useCallback(
    async (event: MouseEvent): Promise<void> => {
      if (event.button !== 2) {
        return;
      }

      blockClickRef.current = false;
      blockContextRef.current = false;

      const element = event.target instanceof HTMLElement ? event.target : undefined;

      buttonDownRef.current = true;

      if (forceContextRef.current) {
        endGesture();
        return;
      }

      moveGesture(event);

      startGesture({ x: event.clientX, y: event.clientY }, element);
    },
    [endGesture, moveGesture, startGesture],
  );

  const handleContextMenu = useCallback(
    (event: MouseEvent): void => {
      const shouldBlockContext =
        (blockContextRef.current || (buttonDownRef.current && gestureRef.current.line)) && !forceContextRef.current;

      if (shouldBlockContext) {
        event.preventDefault();
        event.stopPropagation();
        blockContextRef.current = false;
      } else {
        // since the context menu is about to be shown, close all open gestures.
        endGesture();
        buttonDownRef.current = false;
      }
    },
    [endGesture],
  );

  const handleMouseMove = useMemo(
    () =>
      throttle(
        (event: MouseEvent): void => {
          if (gestureRef.current.events) {
            moveGesture(event);
          }
        },
        16,
        { edges: ['leading', 'trailing'] },
      ),
    [moveGesture],
  );

  const handleMouseUp = useCallback(
    async (event: MouseEvent): Promise<void> => {
      if (event.button !== 2) {
        return;
      }

      if (gestureRef.current.line) {
        moveGesture(event, true);
        if (gestureRef.current.line.code) {
          await sendGesture(gestureRef.current.line.code);
          event.preventDefault();

          blockContextRef.current = true;
          blockClickRef.current = true;
        }
      }

      gestureRef.current.line = undefined;

      if (!forceContextRef.current && !blockContextRef.current && !navigator.userAgent.includes('Win')) {
        forceContextRef.current = true;
        window.setTimeout(() => {
          forceContextRef.current = false;
        }, 600);

        const menuPos = getContextMenuPosition(event.screenX, event.screenY, event.clientX, event.clientY);
        await onRightClick?.(menuPos);
      }

      if (blockClickRef.current) {
        event.preventDefault();
      }

      buttonDownRef.current = false;

      endGesture();
    },
    [moveGesture, sendGesture, onRightClick, endGesture],
  );

  const handleWindowBlurred = useCallback((): void => {
    buttonDownRef.current = false;
    blockClickRef.current = false;
    blockContextRef.current = true;
    endGesture();
  }, [endGesture]);

  /*
   * Enable/Disable
   */
  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown, true);
    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('mousemove', handleMouseMove, true);
    window.addEventListener('mouseup', handleMouseUp, true);
    window.addEventListener('blur', handleWindowBlurred);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown, true);
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('mousemove', handleMouseMove, true);
      window.removeEventListener('mouseup', handleMouseUp, true);
      window.removeEventListener('blur', handleWindowBlurred);

      handleMouseMove.cancel();
    };
  }, [handleMouseDown, handleContextMenu, handleMouseMove, handleMouseUp, handleWindowBlurred]);

  return {
    isOpen,
    gestureRef,
  };
}
