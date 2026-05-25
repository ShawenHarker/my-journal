import { batch, html, navigate, signal } from 'tina4js';
import { errorMessage } from "../state/global-state";
import { registerNewUser } from "../api/account";
import '@/components/show-toast-message';

export const RegisterNewUser = () => {
    const registerFirstName = signal<string>('', 'registerFirstName');
    const registerLastName = signal<string>('', 'registerLastName');
    const registerEmail = signal<string>('', 'registerEmail');
    const registerConfirmPassword = signal<string>('', 'registerConfirmEmail');
    const registerPassword = signal<string>('', 'registerPassword');
    const isPasswordMatch = signal<boolean>(false, 'isPasswordMatch');

    const handlePasswordMatch = (currentPassword: string, currentConfirm: string) => {
        isPasswordMatch.value = currentPassword === currentConfirm;
    };

    const handleRegistrationSubmit = async (e: Event) => {
        e.preventDefault();

        if (!isPasswordMatch.value) {
            errorMessage.value = 'Passwords do not match';
            return;
        }

        const payload = {
            firstName: registerFirstName.value,
            lastName: registerLastName.value,
            email: registerEmail.value,
            password: registerPassword.value
        }

        const status = await registerNewUser(payload);

        if (status === 'Successful') {
            batch(() => {
                registerFirstName.value = '';
                registerLastName.value = '';
                registerEmail.value = '';
                registerPassword.value = '';
                registerConfirmPassword.value = '';
            });

            navigate('/new-entry', { replace: true });
        } else {
            if (window.location.pathname !== '/login') {
                navigate('/login');
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
                           @input=${(e: Event) => registerFirstName.value = (e.target as HTMLInputElement).value}>
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
                           @input=${(e: Event) => registerLastName.value = (e.target as HTMLInputElement).value}>
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
                           @input=${(e: Event) => registerEmail.value = (e.target as HTMLInputElement).value}>
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
                           type="text"
                           @input=${(e: Event) => {
                               registerPassword.value = (e.target as HTMLInputElement).value;
                               handlePasswordMatch(registerPassword.value, registerConfirmPassword.value);
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
                           type="text"
                           @input=${(e: Event) => {
                               registerConfirmPassword.value = (e.target as HTMLInputElement).value;
                               handlePasswordMatch(registerPassword.value, registerConfirmPassword.value);
                           }}>
                    <div class="d-flex justify-content-end">
                        <button type="submit"
                                class="btn btn-primary"
                                style="${() => {
                                    const isDisabled = registerEmail.value === '' || !isPasswordMatch.value;
                                    return `
                                background-color: ${isDisabled ? 'transparent' : 'var(--primary-color)'};
                                border-color: var(--primary-color);
                                color: ${isDisabled ? 'var(--primary-color)' : '#fff'};
                            `;
                                }}"
                                ?disabled=${() => registerEmail.value === '' || !isPasswordMatch.value}
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
