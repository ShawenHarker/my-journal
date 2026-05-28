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