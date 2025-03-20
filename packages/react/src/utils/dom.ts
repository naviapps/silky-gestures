import { Point } from '@/types';

export function getLink(node: Node): string | undefined {
  if (!(node instanceof Element)) {
    return undefined;
  }
  const element = node.closest<HTMLElement>('[href]');
  return element?.getAttribute('href') ?? undefined;
}

export function extractLinksFromText(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s"'<>()]+?)(?:[.,!?;:)\]]+)?(?=\s|$)/g;
  const links: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = urlRegex.exec(text))) {
    links.push(m[1]);
  }
  return links;
}

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
