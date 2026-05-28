import { signal, Signal } from 'tina4js';

type StorageStrategy = 'local' | 'session';

const getStorage = (strategy: StorageStrategy): Storage => {
    return strategy === 'session' ? sessionStorage : localStorage;
}

const persist = <T>(s: Signal<T>, key: string, strategy: StorageStrategy = 'local')=> {
    s._subscribe(() => {
        if (s.value === null || s.value === undefined) {
            getStorage(strategy).removeItem(key);
        } else {
            getStorage(strategy).setItem(key, JSON.stringify(s.value));
        }
    });
    return s;
}

export const persistentSignal = <T>(defaultValue: T, key: string, strategy: StorageStrategy = 'local')=> {
    const stored = getStorage(strategy).getItem(key);
    let initial: T;

    try {
        if (stored === null) {
            initial = defaultValue;
        } else {
            const parsed = JSON.parse(stored);
            initial = (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed) &&
                defaultValue !== null && typeof defaultValue === 'object')
                ? { ...defaultValue, ...parsed }
                : parsed;
        }
    } catch {
        initial = defaultValue;
    }

    return persist(signal<T>(initial, key), key, strategy);
}

export const clearPersistedKeys = (keys: string[], strategy: StorageStrategy = 'session'): void => {
    keys.forEach(key => getStorage(strategy).removeItem(key));
}