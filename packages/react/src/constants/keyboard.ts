export const MODIFIER_KEYS = ['Control', 'Alt', 'Shift', 'Meta'] as const;

export type ModifierKey = (typeof MODIFIER_KEYS)[number];
