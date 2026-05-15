import { setErrorMessage } from "../helpers/helpers";

const baseURL = import.meta.env.VITE_BASE_URL;

let failureCount = 0;
const MAX_FAILURES = 10;
const THROTTLE_MS = 200;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getAuthHeaders = () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
        return {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        };
    }

    return {
        "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
        "Content-Type": "application/json",
    };
};

const pendingRequests: Map<string, AbortController> = new Map();

const makeKey = (method: string, url: string, data?: unknown) =>
    `${method}|${url}|${data ? JSON.stringify(data) : ""}`;

export function handleError(err: unknown): never {
    if (err instanceof Error) {
        setErrorMessage(err.message);
        throw new Error(err.message);
    }

    if (typeof err === 'string') {
        setErrorMessage(err);
        throw new Error(err);
    }

    setErrorMessage('An unknown error occurred.');
    throw new Error('An unknown error occurred.');
}

const apiHandler = async (url: string, method: string, data?: unknown) => {
    const key = makeKey(method, url, data);

    // Abort previous request for the same key
    const prev = pendingRequests.get(key);
    if (prev) {
        prev.abort();
    }

    const controller = new AbortController();
    pendingRequests.set(key, controller);

    let headers: Record<string, string> = getAuthHeaders();

    if (method === "DELETE") {
        headers = {
            "Authorization": headers["Authorization"],
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
                localStorage.removeItem("accessToken");
                window.location.href = `${import.meta.env.VITE_API_BASE_URL}/login`;
            }

            throw new Error(`Request failed with status: ${response.status}`);
        }

        const text = await response.text();

        try {
            result = text ? JSON.parse(text) : null;
        } catch {
            throw new Error('Failed to parse server response');
        }
    } catch (error) {
        // Ignore aborted requests (do not count as failures)
        if (error instanceof Error && error.name === "AbortError") {
            result = undefined;
        } else {
            result = undefined;
            handleError(error);
        }
    } finally {
        // Clean up controller for this key
        if (pendingRequests.get(key) === controller) {
            pendingRequests.delete(key);
        }
    }

    return result;
};

const apiRequest = async (method: string, url: string, data?: unknown) => {
    if (failureCount >= MAX_FAILURES) {
        throw new Error("Too many failed API requests. Throttling stopped.");
    }

    await sleep(THROTTLE_MS);

    try {
        let response = null;

        response = await apiHandler(url, method, data);

        failureCount = 0;
        return response;
    } catch (error) {
        // Only count non-abort failures
        if (error instanceof Error && error.name !== "AbortError") {
            failureCount += 1;
        }

        if (failureCount >= MAX_FAILURES) {
            handleError(error);
        }
    }
};

export default apiRequest;
