import { signal } from 'tina4js';

export const selectedMood = signal<number>(0, 'selectedMood');
export const selectedTags = signal<number[]>([], 'selectedTags');
export const journalTitle = signal<string>('', 'title');
export const journaledText = signal<string>('', 'journaledText');
