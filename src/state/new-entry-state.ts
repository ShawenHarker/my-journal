import { signal } from 'tina4js';

export const selectedMood = signal<string>('', 'selectedMood');
export const selectedTags = signal<string[]>([], 'selectedTags');
export const journaledText = signal<string>('', 'journaledText');
