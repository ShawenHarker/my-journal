import { errorMessage } from '../state/global-state';
import { navigate } from 'tina4js';

const baseURL = import.meta.env.VITE_BASE_URL;

let failureCount = 0;
const MAX_FAILURES = 10;
const THROTTLE_MS = 200;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        return {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };
    }

    return {
        'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`,
        'Content-Type': 'application/json',
    };
};

const pendingRequests: Map<string, AbortController> = new Map();

const makeKey = (method: string, url: string, data?: unknown) =>
    `${method}|${url}|${data ? JSON.stringify(data) : ''}`;

const apiHandler = async (url: string, method: string, data?: unknown) => {
    const key = makeKey(method, url, data);

    const prev = pendingRequests.get(key);
    if (prev) {
        prev.abort();
    }

    const controller = new AbortController();
    pendingRequests.set(key, controller);

    let headers: Record<string, string> = getAuthHeaders();

    if (method === 'DELETE') {
        headers = {
            'Authorization': headers['Authorization'],
        };
    }

    let result: unknown = undefined;

    try {
        const response = await fetch(`${baseURL}${url}`, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined,
            signal: controller.signal
        });

        if (!response.ok) {
            if (response.status === 403 || response.status === 401) {
                navigate('/login', {replace: true});
            }

            errorMessage.value = `Request failed with status: ${response.status}`;
        }

        const text = await response.text();

        try {
            result = text ? JSON.parse(text) : null;
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