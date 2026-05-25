import { errorMessage } from "../state/global-state";
import { signal, Signal } from 'tina4js';

export const setErrorMessage = (message: string) => {
    errorMessage.value = message;
    setTimeout(() => {
        errorMessage.value = '';
    }, 3000);
}

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