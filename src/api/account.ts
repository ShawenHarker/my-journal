import apiHandler, { handleError } from './apiHandler';
import { setErrorMessage } from "../helpers/helpers";

interface LoginCredentialsProps {
    email: string;
    password: string;
}

interface ResponseProps {
    data: {
        token: string;
        message: string;
        status: number;
    }
}

interface RegistrationCredentialsProps {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const login = async (credentials: LoginCredentialsProps): Promise<string> => {
    try {
        const response = await apiHandler('auth/login', 'POST', credentials) as ResponseProps;

        if (response.data.token && response.data.status === 200) {
            localStorage.setItem('accessToken', response.data.token);
            return 'successful';
        }

        setErrorMessage(response.data.message);
        return 'error';
    } catch (e: unknown) {
        handleError(e);
        return 'error';
    }
}

export const registerNewUser = async (credentials: RegistrationCredentialsProps ): Promise<string> => {
    try {
        const response = await apiHandler('auth/register', 'POST', credentials) as ResponseProps;

        if (response.data.token && response.data.status === 200) {
            localStorage.setItem('accessToken', response.data.token);
            return 'successful';
        }

        setErrorMessage(response.data.message);
        return 'error';
    } catch (e: unknown) {
        handleError(e);
        return 'error';
    }
}