import apiHandler from './apiHandler';
import { handleError } from "../helpers/helpers";
import { errorMessage, user, successMessage, isValidUser } from '../state/global-state';
import { navigate } from "tina4js";
import { createUserEncryption, generateRecoveryKey, unlockSessionKey, clearSessionKey } from "../helpers/crypto";
import { clearPersistedKeys } from '../helpers/persistentSignal';

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
            encrypted_dek: string;
            dek_iv: string;
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

        if (!response) {
            errorMessage.value = 'There is an issue and our team will resolve it shortly.';
            return 'Error';
        }

        if (response.status === 'Successful') {
            successMessage.value = response.notification;
            isValidUser.value = response.info.is_session_valid;

            const { first_name, last_name, current_streak, encrypted_dek, dek_iv } = response.info.user;

            user.value = {
                firstName: first_name,
                lastName: last_name,
                currentStreak: current_streak
            };

            await unlockSessionKey(
                credentials.password,
                encrypted_dek,
                dek_iv
            );

            return response.status;
        }

        errorMessage.value = response.notification;
        return response.status;
    } catch (e: unknown) {
        handleError(e);
        return 'Error';
    }
}

export const registerNewUser = async (credentials: RegistrationCredentialsProps ): Promise<{status: string, recoveryKey: string | null}> => {
    try {
        const getRecoveryKey = await generateRecoveryKey();
        const encryption = await createUserEncryption(credentials.password, getRecoveryKey)

        const data = {
            'first_name': credentials.firstName,
            'last_name': credentials.lastName,
            'email': credentials.email,
            'mobile': credentials.mobile,
            'password': credentials.password,
            'encrypted_dek': encryption.encryptedDEK,
            'dek_iv': encryption.dekSalt,
            'recovery_key_hash': encryption.recoveryKeyHash,
        }

        const response = await apiHandler('api/auth/register', 'POST', data) as ResponseLoginProps;

        if (!response) {
            errorMessage.value = 'There is an issue and our team will resolve it shortly.';
            return {
                status: 'Error',
                recoveryKey: null
            };
        }

        if (response.status === 'Successful') {
            successMessage.value = response.notification;

            user.value = {
                firstName: response.info.user.first_name,
                lastName: response.info.user.last_name,
                currentStreak: response.info.user.current_streak
            };

            await unlockSessionKey(
                credentials.password,
                encryption.encryptedDEK,
                encryption.dekSalt
            );

            return {
                status: response.status,
                recoveryKey: getRecoveryKey
            };
        }

        errorMessage.value = response.notification;
        return {
            status: 'Error',
            recoveryKey: null
        };
    } catch (e: unknown) {
        handleError(e);
        return {
            status: 'Error',
            recoveryKey: null
        };
    }
}

export const forgetPassword = async (credentials: ForgetPasswordProps): Promise<string> => {
    try {
        const response = await apiHandler('api/auth/forget-password', 'POST', credentials) as ResponseForgetPasswordProps;

        if (!response) {
            errorMessage.value = 'There is an issue and our team will resolve it shortly.';
            return 'Error';
        }

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
        clearSessionKey();                    // <-- clear the DEK from memory
        clearPersistedKeys(['user']);          // <-- clear persisted user data
        isValidUser.value = false;
        user.value = {
            firstName: '',
            lastName: '',
            currentStreak: 0,
        };
        localStorage.removeItem('draft');     // <-- removeItem not setItem('')

        const response = await apiHandler('api/auth/logout', 'POST') as LogoutResponseProps;
        successMessage.value = response.notification;
        navigate('/login', { replace: true });

        return response.status;
    } catch (e) {
        handleError(e);
        return 'Error';
    }
}