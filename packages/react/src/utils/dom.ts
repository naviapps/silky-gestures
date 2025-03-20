const EDITABLE_ELEMENT_SELECTOR = 'input, textarea, select, [contenteditable]';

export function isEditableElement(
  element: EventTarget | null | undefined,
): element is HTMLElement {
  return (
    element instanceof HTMLElement && element.matches(EDITABLE_ELEMENT_SELECTOR)
  );
}

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
