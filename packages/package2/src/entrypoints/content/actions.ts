import { LinkMessage } from '@/types';

export const stop = (): void => {
  window.stop();
};

export const gotoTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

export const gotoBottom = (): void => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  });
};

export const pageUp = (): void => {
  window.scrollBy({
    top: -window.innerHeight * 0.8,
    behavior: 'smooth',
  });
};

export const pageDown = (): void => {
  window.scrollBy({
    top: window.innerHeight * 0.8,
    behavior: 'smooth',
  });
};

export const pageNext = (): void => {
  const relationship = document.querySelector<HTMLLinkElement | HTMLAnchorElement>(
    'link[rel="next"][href], a[rel="next"][href]',
  );
  if (relationship) {
    globalThis.location.href = relationship.href;
    return;
  }
  const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href]');
  for (const anchor of anchors) {
    if (anchor.textContent && /(next|次|下一页)/i.test(anchor.textContent)) {
      globalThis.location.href = anchor.href;
      return;
    }
  }
};

export const pagePrevious = (): void => {
  const relationship = document.querySelector<HTMLLinkElement | HTMLAnchorElement>(
    'link[rel="prev"][href], a[rel="prev"][href]',
  );
  if (relationship) {
    globalThis.location.href = relationship.href;
    return;
  }
  const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href]');
  for (const anchor of anchors) {
    if (anchor.textContent && /(prev|前|上一页)/i.test(anchor.textContent)) {
      globalThis.location.href = anchor.href;
      return;
    }
  }
};

export const showCookies = (): void => {
  globalThis.alert(
    `Cookies stored by this host or domain:\n${`\n${document.cookie}`
      .replaceAll('; ', ';\n')
      .replaceAll(/\n(.{192})([^\\n]{5})/gm, '\n$1\n        $2')
      .replaceAll(/\n(.{100})([^\\n]{5})/gm, '\n$1\n        $2')}`,
  );
};

export const print = (): void => {
  globalThis.print();
};

export const copy = async (selection: string): Promise<void> => {
  await navigator.clipboard.writeText(selection);
};

export const copyLink = async (links: LinkMessage[]): Promise<void> => {
  await navigator.clipboard.writeText(links[0].src);
};
