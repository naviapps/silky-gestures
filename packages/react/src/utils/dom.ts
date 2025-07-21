export function getLink(node: Node): string | undefined {
  if (!(node instanceof Element)) {
    return undefined;
  }
  const element = node.closest<HTMLElement>('[href]');
  return element?.getAttribute('href') ?? undefined;
}
