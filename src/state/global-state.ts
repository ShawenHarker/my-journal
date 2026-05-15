import { signal } from 'tina4js';

export const errorMessage = signal<string>('', 'errorMessage');