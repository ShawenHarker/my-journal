import { batch, html, navigate, signal } from 'tina4js';
import { errorMessage, isPasswordMatch } from "../state/global-state";
import { registerNewUser } from "../api/account";
import '@/components/show-toast-message';
import { handlePasswordMatch } from '../helpers/helpers';

export const RegisterNewUser = () => {
    const firstName = signal<string>('', 'registerFirstName');
    const lastName = signal<string>('', 'registerLastName');
    const email = signal<string>('', 'registerEmail');
    const password = signal<string>('', 'registerPassword');
    const confirmPassword = signal<string>('', 'registerConfirmPassword');

    const handleRegistrationSubmit = async (e: Event) => {
        e.preventDefault();

        if (!isPasswordMatch.value) {
            errorMessage.value = 'Passwords do not match';
            return;
        }

        const payload = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value
        }

        const status = await registerNewUser(payload);

        if (status === 'Successful') {
            batch(() => {
                firstName.value = '';
                lastName.value = '';
                email.value = '';
                password.value = '';
                confirmPassword.value = '';
                isPasswordMatch.value = false;
            });

            navigate('/new-entry', { replace: true });
        } else {
            if (window.location.pathname !== '/login') {
                navigate('/login', { replace: true });
            }
        }
    };

    return html`
        <div>
            <show-toast-message></show-toast-message>
            <div class="d-flex justify-content-center align-items-center" style="height: 97vh;">
                <form id="register-form" @submit=${handleRegistrationSubmit} style="width: 100%; max-width: 400px;">
                    <h1 class="text-primary text-center">Journal With Me</h1>
                    <h4 class="text-muted mb-3 text-center">Create a new account</h4>
                    <input placeholder="First Name"
                           style="
                                width: 100%;
                                max-width: 400px;
                                background-color: transparent;
                                border: 1px solid var(--primary-color);
                                border-radius: var(--radius-md);
                                margin-bottom: 1rem;
                                padding: 4px 8px;
                            "
                           type="text"
                           @input=${(e: Event) => firstName.value = (e.target as HTMLInputElement).value}>
                    <input placeholder="Last Name"
                           style="
                                width: 100%;
                                max-width: 400px;
                                background-color: transparent;
                                border: 1px solid var(--primary-color);
                                border-radius: var(--radius-md);
                                margin-bottom: 1rem;
                                padding: 4px 8px;
                            "
                           type="text"
                           @input=${(e: Event) => lastName.value = (e.target as HTMLInputElement).value}>
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
                        Already have an account, login
                        <a href="/login" class="fw-bold">here</a>
                    </p>
                </form>
            </div>
        </div>
    `;
}
