import apiHandler from './apiHandler';
import {handleError} from "../helpers/helpers";
import { errorMessage, user, successMessage } from '../state/global-state';

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

interface ForgetPasswordProps {
    email: string;
    password: string;
}

interface ResponseForgetPasswordProps {
    status: string;
    notification: string;
    info: {}
}

export const login = async (credentials: LoginCredentialsProps): Promise<string> => {
    try {
        const response = await apiHandler('api/auth/login', 'POST', credentials) as ResponseLoginProps;

        if (response.status === 'Successful') {
            successMessage.value = response.notification;

            user.value = {
                firstName: response.info.user.first_name,
                lastName: response.info.user.last_name,
                currentStreak: response.info.user.current_streak,
                sevenDayStreak: response.info.user.seven_day_streak
            };

            return 'Successful';
        }

        errorMessage.value = response.notification;
        return 'Error';
    } catch (e: unknown) {
        handleError(e);
        return 'Error';
    }
}

export const registerNewUser = async (credentials: RegistrationCredentialsProps ): Promise<string> => {
    try {
        const data = {
            'first_name': credentials.firstName,
            'last_name': credentials.lastName,
            'email': credentials.email,
            'password': credentials.password
        }

        const response = await apiHandler('api/auth/register', 'POST', data) as ResponseLoginProps;

        if (response.status === 'Successful') {
            successMessage.value = response.notification;

            user.value = {
                firstName: response.info.user.first_name,
                lastName: response.info.user.last_name,
                currentStreak: response.info.user.current_streak,
                sevenDayStreak: response.info.user.seven_day_streak
            };

            return 'Successful';
        }

        errorMessage.value = response.notification;
        return 'Error';
    } catch (e: unknown) {
        handleError(e);
        return 'Error';
    }
}

export const forgetPassword = async (credentials: ForgetPasswordProps): Promise<string> => {
    try {
        const response = await apiHandler('api/auth/forget-password', 'POST', credentials) as ResponseForgetPasswordProps;

        if (response.status === 'Successful') {
            successMessage.value = response.notification;
            return 'Successful';
        }

        errorMessage.value = response.notification;
        return 'Error'
    } catch (e) {
        handleError(e);
        return 'Error';
    }
}