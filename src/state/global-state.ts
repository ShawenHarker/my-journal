import { signal } from 'tina4js';
import { persistentSignal } from '../helpers/helpers';

interface UserProps {
    id: number;
    firstName: string;
    lastName: string;
    currentStreak: number;
    sevenDayStreak: number;
}

export const user = persistentSignal<UserProps>({
    id: 0,
    firstName: '',
    lastName: '',
    currentStreak: 0,
    sevenDayStreak: 0,
}, 'user');
export const errorMessage = signal<string>('', 'errorMessage');
export const successMessage = signal<string>('', 'successMessage');