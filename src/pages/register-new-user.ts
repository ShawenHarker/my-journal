import { batch, html, navigate, signal } from 'tina4js';
import { errorMessage, isPasswordMatch, recoveryKey } from "../state/global-state";
import { registerNewUser } from "../api/account";
import '@/components/show-toast-message';
import { handlePasswordMatch } from '../helpers/helpers';

const renderRecoveryKeyModal = () => {
    return html`
        <div style="position: fixed; inset: 0; z-index: 1050;">
            <div style="
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.5);
            "></div>
            <div class="modal show"
                 style="display: flex; align-items: center; justify-content: center; position: fixed; inset: 0; z-index: 1055;"
                 tabindex="-1">
                <div class="modal-dialog" style="margin: 0;">
                    <div class="modal-content">
                        <div class="modal-header border-0">
                            <h3 style="color: var(--coral-dot);">Save your Recovery Key</h3>
                        </div>
                        <div class="modal-body">
                            <p style="margin-bottom: 1rem;">
                                This is the
                                <strong style="color: var(--primary-color);">ONLY</strong>
                                way to recover your account should you forget your password:
                            </p>
                            <code style="
                                display: block;
                                padding: 10px;
                                background: var(--primary-bg);
                                color: var(--primary-color);
                                border-radius: var(--radius-md);
                                word-break: break-all;
                                font-size: 14px;
                                margin-bottom: 1rem;
                            ">${recoveryKey.value}</code>
                            <div class="d-flex justify-content-end">
                                <button type="button"
                                        class="btn btn-primary"
                                        @click=${() => {
                                            recoveryKey.value = null;
                                            navigate('/new-entry', { replace: true });
                                        }}>
                                    I have saved it
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export const RegisterNewUser = () => {
    const firstName = signal<string>('', 'registerFirstName');
    const lastName = signal<string>('', 'registerLastName');
    const email = signal<string>('', 'registerEmail');
    const mobile = signal<number | null>(null, 'registerMobile');
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
            mobile: mobile.value,
            password: password.value
        }

        const response: { status: string, recoveryKey: string | null } = await registerNewUser(payload);

        if (response.status === 'Successful' && response.recoveryKey) {
            recoveryKey.value = response.recoveryKey;
            batch(() => {
                firstName.value = '';
                lastName.value = '';
                email.value = '';
                password.value = '';
                confirmPassword.value = '';
                isPasswordMatch.value = false;
            });
        }
    };

    return html`
        <div>
            ${() => recoveryKey.value !== null ? renderRecoveryKeyModal() : html`
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
                        <input placeholder="Mobile Number"
                               style="
                                width: 100%;
                                max-width: 400px;
                                background-color: transparent;
                                border: 1px solid var(--primary-color);
                                border-radius: var(--radius-md);
                                margin-bottom: 1rem;
                                padding: 4px 8px;
                            "
                               type="number"
                               @input=${(e: Event) => {
                                   const val = (e.target as HTMLInputElement).value;
                                   mobile.value = val === '' ? null : Number(val);
                               }}>
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
            `
            }
        </div>
    `;
}
