import apiHandler, { handleError } from './apiHandler';
import { setErrorMessage } from "../helpers/helpers";
import { user, successMessage } from "../state/global-state";

interface LoginCredentialsProps {
    email: string;
    password: string;
}

interface ResponseLoginProps {
    status: string;
    notification: string;
    info: {
        accessToken: string;
        user: {
            id: number;
            first_name: string;
            last_name: string;
            current_streak: number;
            seven_day_streak: number;
        }
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
        const response = await apiHandler('auth/login', 'POST', credentials) as ResponseLoginProps;

        if (response.info?.accessToken && response.status === 'Successful') {
            localStorage.setItem('accessToken', response.info.accessToken);
            successMessage.value = 'Login successful';
            user.value = response.info.user;
            return 'Successful';
        }

        setErrorMessage(response.notification);
        return 'Error';
    } catch (e: unknown) {
        handleError(e);
        return 'Error';
    }
}

export const registerNewUser = async (credentials: RegistrationCredentialsProps ): Promise<string> => {
    try {
        const data = {
            "first_name": credentials.firstName,
            "last_name": credentials.lastName,
            "email": credentials.email,
            "password": credentials.password
        }

        const response = await apiHandler('api/auth/register', 'POST', data) as ResponseLoginProps;

        if (response.info?.accessToken && response.status === 'Successful') {
            localStorage.setItem('accessToken', response.info.accessToken);
            successMessage.value = 'Registration successful';
            user.value = response.info.user;
            return 'Successful';
        }

        setErrorMessage(response.notification);
        return 'Error';
    } catch (e: unknown) {
        handleError(e);
        return 'Error';
    }
}