import { signal } from 'tina4js';

interface UserProps {
    id: number;
    first_name: string;
    last_name: string;
    current_streak: number;
    seven_day_streak: number;
}

export const user = signal<UserProps>({
    id: 0,
    first_name: '',
    last_name: '',
    current_streak: 0,
    seven_day_streak: 0,
}, 'user');
export const errorMessage = signal<string>('', 'errorMessage');
export const successMessage = signal<string>('', 'successMessage');