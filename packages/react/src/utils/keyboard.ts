import { MODIFIER_KEYS, ModifierKey } from '@/constants';

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
