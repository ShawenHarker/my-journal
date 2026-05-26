import {batch, html, navigate, signal} from 'tina4js';
import '@/components/show-toast-message';
import { forgetPassword } from '../api/account';
import { handlePasswordMatch } from '../helpers/helpers';
import { errorMessage, isPasswordMatch } from "../state/global-state";

export const ForgotPassword = () => {
    const email = signal<string>('', 'forgetPasswordEmail');
    const password = signal<string>('', 'forgetPasswordPassword');
    const confirmPassword = signal<string>('', 'forgetPasswordConfirmPassword');

    const handleForgotPasswordSubmit = async (e: Event) => {
        e.preventDefault();

        if (!isPasswordMatch.value) {
            errorMessage.value = 'Passwords do not match';
            return;
        }

        const payload = {
            email: email.value,
            password: password.value
        }

        const status: string = await forgetPassword(payload);

        if (status === 'Successful') {
            batch(() => {
                email.value = '';
                password.value = '';
                confirmPassword.value = '';
                isPasswordMatch.value = false;
            });

            navigate('/login', { replace: true });
        } else {
            if (window.location.pathname !== '/forgot-password') {
                navigate('/forgot-password', { replace: true });
            }
        }
    }

    return html`
        <div>
            <show-toast-message></show-toast-message>
            <div class="d-flex justify-content-center align-items-center" style="height: 97vh;">
                <form id="forgot-password-form" @submit=${handleForgotPasswordSubmit} style="width: 100%; max-width: 400px;">
                    <h1 class="text-primary text-center">Journal With Me</h1>
                    <h4 class="text-muted mb-3 text-center">Forgot Password</h4>
                    <input placeholder="Email"
                           style="
                                width: 100%;
                                max-width: 400px;
                                background-color: transparent;
                                border: 1px solid var(--primary-color);
                                border-radius: var(--radius-md);
                                margin-bottom: 1rem;
                                padding: 4px 8px;
                            "
                           type="email"
                           @input=${(e: Event) => email.value = (e.target as HTMLInputElement).value}>
                    <input placeholder="Password"
                           style="
                                width: 100%;
                                max-width: 400px;
                                background-color: transparent;
                                border: 1px solid var(--primary-color);
                                border-radius: var(--radius-md);
                                margin-bottom: 1rem;
                                padding: 4px 8px;
                            "
                           type="password"
                           @input=${(e: Event) => {
                               password.value = (e.target as HTMLInputElement).value;
                               handlePasswordMatch(password.value, confirmPassword.value);
                           }}>
                    <input placeholder="Confirm Password"
                           style="
                                width: 100%;
                                max-width: 400px;
                                background-color: transparent;
                                border: 1px solid var(--primary-color);
                                border-radius: var(--radius-md);
                                margin-bottom: 1rem;
                                padding: 4px 8px;
                           "
                           type="password"
                           @input=${(e: Event) => {
                               confirmPassword.value = (e.target as HTMLInputElement).value;
                               handlePasswordMatch(password.value, confirmPassword.value);
                           }}>
                    <div class="d-flex justify-content-end">
                        <button type="submit"
                                class="btn btn-primary"
                                style="${() => {
                                    const isDisabled = email.value === '' || !isPasswordMatch.value;
                                    return `
                                        background-color: ${isDisabled ? 'transparent' : 'var(--primary-color)'};
                                        border-color: var(--primary-color);
                                        color: ${isDisabled ? 'var(--primary-color)' : '#fff'};
                                    `;
                                }}"
                                ?disabled=${() => email.value === '' || !isPasswordMatch.value}
                        >
                            Submit
                        </button>
                    </div>
                    <p>
                        Go back to, login
                        <a href="/login" class="fw-bold">here</a>
                    </p>
                </form>
            </div>
        </div>
    `;
}