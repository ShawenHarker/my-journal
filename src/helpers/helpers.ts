import { signal, Signal } from 'tina4js';
import {errorMessage, isPasswordMatch} from '../state/global-state';

export function handleError(err: unknown): never {
    if (err instanceof Error) {
        errorMessage.value = err.message;
        throw new Error(err.message);
    }

    if (typeof err === 'string') {
        errorMessage.value = err;
    }

    errorMessage.value = 'An unknown error occurred.';
    throw new Error('An unknown error occurred.');
}

export const handlePasswordMatch = (currentPassword: string, currentConfirm: string) => {
    isPasswordMatch.value = currentPassword === currentConfirm;
};

function persist<T>(s: Signal<T>, key: string) {
    s._subscribe(() => {
        localStorage.setItem(key, JSON.stringify(s.value));
    });
    return s;
}

export function persistentSignal<T>(defaultValue: T, key: string) {
    const stored = localStorage.getItem(key);
    const initial = stored ? { ...defaultValue, ...JSON.parse(stored) } : defaultValue;
    return persist(signal<T>(initial, key), key);
}