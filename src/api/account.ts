import apiHandler, { handleError } from './apiHandler';
import { setErrorMessage } from "../helpers/helpers";

interface CredentialsProps {
    email: string;
    password: string;
}

interface LoginResponse {
    data: {
        token: string;
        message: string;
        status: number;
    }
}

export const login = async (credentials: CredentialsProps): Promise<string> => {
    try {
        const response = await apiHandler('/login', 'POST', credentials) as LoginResponse;

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