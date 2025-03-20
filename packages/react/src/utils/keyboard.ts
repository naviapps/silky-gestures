const MODIFIER_KEYS = ['Control', 'Alt', 'Shift', 'Meta'] as const;
type ModifierKey = (typeof MODIFIER_KEYS)[number];

const modifierKeySet = new Set<ModifierKey>(MODIFIER_KEYS);

export function isModifierKey(key: unknown): key is ModifierKey {
  return typeof key === 'string' && modifierKeySet.has(key as ModifierKey);
}

export function buildModifierMask({
  ctrlKey,
  altKey,
  shiftKey,
  metaKey,
}: Pick<KeyboardEvent, 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>): string {
  return [ctrlKey, altKey, shiftKey, metaKey]
    .map((pressed) => (pressed ? '1' : '0'))
    .join('');
}

export function buildKeySequence(event: KeyboardEvent): string {
  return `${event.key}:${event.code}`;
}

const EDITABLE_ELEMENT_SELECTOR = 'input, textarea, select, [contenteditable]';

export function isEditableElement(
  element: EventTarget | null | undefined,
): element is HTMLElement {
  return (
    element instanceof HTMLElement && element.matches(EDITABLE_ELEMENT_SELECTOR)
  );
}
