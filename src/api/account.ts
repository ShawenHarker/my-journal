import apiHandler from './apiHandler';
import { handleError } from "../helpers/helpers";
import { errorMessage, user, successMessage, isValidUser } from '../state/global-state';
import { navigate } from "tina4js";
import {clearPersistedKeys} from "../helpers/persistentSignal";

interface LoginCredentialsProps {
    email: string;
    password: string;
}

interface ResponseLoginProps {
    status: string;
    notification: string;
    info: {
        is_session_valid: boolean;
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
    mobile: number | null;
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

interface LogoutResponseProps {
    status: string;
    notification: string;
    info: {}
}

export const login = async (credentials: LoginCredentialsProps): Promise<string> => {
    try {
        const response = await apiHandler('api/auth/login', 'POST', credentials) as ResponseLoginProps;

        if (!response.info.is_session_valid) {
            errorMessage.value = response.notification
            return response.status;
        }

        if (response.status === 'Successful') {
            successMessage.value = response.notification;

            user.value = {
                firstName: response.info.user.first_name,
                lastName: response.info.user.last_name,
                currentStreak: response.info.user.current_streak,
                sevenDayStreak: response.info.user.seven_day_streak
            };

            isValidUser.value = response.info.is_session_valid;

            return response.status;
        }

        errorMessage.value = response.notification;
        return response.status;
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
            'mobile': credentials.mobile,
            'password': credentials.password
        }

        const response = await apiHandler('api/auth/register', 'POST', data) as ResponseLoginProps;

        if (!response.info.is_session_valid) {
            errorMessage.value = response.notification
            return response.status;
        }

        if (response.status === 'Successful') {
            successMessage.value = response.notification;

            user.value = {
                firstName: response.info.user.first_name,
                lastName: response.info.user.last_name,
                currentStreak: response.info.user.current_streak,
                sevenDayStreak: response.info.user.seven_day_streak
            };

            isValidUser.value = response.info.is_session_valid;

            return response.status;
        }

        errorMessage.value = response.notification;
        return response.status;
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
            return response.status;
        }

        errorMessage.value = response.notification;
        return response.status;
    } catch (e) {
        handleError(e);
        return 'Error';
    }
}

export const logout = async () => {
    try {
        clearPersistedKeys(['isValidUser', 'user']);

        isValidUser.value = false;
        user.value = {
            firstName: '',
            lastName: '',
            currentStreak: 0,
            sevenDayStreak: 0
        };

        const response = await apiHandler('api/auth/logout', 'POST') as LogoutResponseProps;
        successMessage.value = response.notification;
        navigate('/login', { replace: true });

        return response.status;
    } catch (e) {
        handleError(e);
        return 'Error';
    }
}