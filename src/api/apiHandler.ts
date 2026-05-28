import { errorMessage, isValidUser, user } from '../state/global-state';
import { clearPersistedKeys } from '../helpers/persistentSignal';
import { navigate } from 'tina4js';

const baseURL = import.meta.env.VITE_BASE_URL;

let failureCount = 0;
const MAX_FAILURES = 10;
const THROTTLE_MS = 200;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getAuthHeaders = () => ({
    'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`,
    'Content-Type': 'application/json',
});

const pendingRequests: Map<string, AbortController> = new Map();

const makeKey = (method: string, url: string, data?: unknown) =>
    `${method}|${url}|${data ? JSON.stringify(data) : ''}`;

const clearAuthState = () => {
    clearPersistedKeys(['user']);
    isValidUser.value = false;
    user.value = {
        firstName: '',
        lastName: '',
        currentStreak: 0,
        sevenDayStreak: 0
    };
};

const syncSessionState = (result: unknown): void => {
    if (result && typeof result === 'object') {
        const res = result as Record<string, any>;
        const sessionValid = res?.info?.is_session_valid;

        if (sessionValid === true) {
            isValidUser.value = true;
        } else if (sessionValid === false) {
            clearAuthState();
            navigate('/login', { replace: true });
        }
    }
};

const apiHandler = async (url: string, method: string, data?: unknown) => {
    const key = makeKey(method, url, data);

    const prev = pendingRequests.get(key);
    if (prev) prev.abort();

    const controller = new AbortController();
    pendingRequests.set(key, controller);

    let headers: Record<string, string> = getAuthHeaders();

    if (method === 'DELETE') {
        headers = { 'Authorization': headers['Authorization'] };
    }

    let result: unknown = undefined;

    try {
        const response = await fetch(`${baseURL}${url}`, {
            method,
            headers,
            credentials: 'include',
            body: data ? JSON.stringify(data) : undefined,
            signal: controller.signal
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                clearAuthState();
                navigate('/login', { replace: true });
                return;
            }

            errorMessage.value = `Request failed with status: ${response.status}`;
        }

        const text = await response.text();

        try {
            result = text ? JSON.parse(text) : null;
            syncSessionState(result);
        } catch {
            errorMessage.value = 'Failed to parse server response';
        }
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            result = undefined;
        } else {
            throw error;
        }
    } finally {
        if (pendingRequests.get(key) === controller) {
            pendingRequests.delete(key);
        }
    }

    return result;
};

const apiRequest = async (url: string, method: string, data?: unknown) => {
    if (failureCount >= MAX_FAILURES) {
        errorMessage.value = 'Too many failed API requests. Throttling stopped.';
        throw new Error('Too many failed API requests. Throttling stopped.');
    }

    await sleep(THROTTLE_MS);

    try {
        const response = await apiHandler(url, method, data);
        failureCount = 0;
        return response;
    } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
            failureCount += 1;
        }
        throw error;
    }
};

export default apiRequest;