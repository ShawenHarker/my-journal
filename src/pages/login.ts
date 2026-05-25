import { batch, html, navigate, signal } from 'tina4js';
import '@/components/show-toast-message';
import { login } from '../api/account';

export const Login = () => {
  const loginEmail = signal<string>('', 'loginEmail');
  const loginPassword = signal<string>('', 'loginPassword');

  const payload = {
      email: loginEmail.value,
      password: loginPassword.value,
  }

    const handleLoginSubmit = async (e: Event) => {
        e.preventDefault();
        const status = await login(payload);

        if (status === 'successful') {
            batch(() => {
                loginEmail.value = '';
                loginPassword.value = '';
            });

            navigate('/my-journal', { replace: true });
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
            <form id="login-form" @submit=${handleLoginSubmit} style="width: 100%; max-width: 400px;">
                <h1 class="text-primary text-center">Journal With Me</h1>
                <h4 class="text-muted mb-3 text-center">Login to your account</h4>
                <p>
                    Register as a new user
                    <a href="/register-new-user" class="fw-bold">here</a>
                </p>
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
                       @input=${(e: Event) => loginEmail.value = (e.target as HTMLInputElement).value}>
                <input placeholder="Password"
                       style="
                        width: 100%;
                        background-color: transparent;
                        border: 1px solid var(--primary-color);
                        border-radius: var(--radius-md);
                        margin-bottom: 1rem;
                        padding: 4px 8px;
                    "
                       type="text"
                       @input=${(e: Event) => loginPassword.value = (e.target as HTMLInputElement).value}>
                <a href="/forgot-password" class="d-flex justify-content-end mb-3">Forget Password?</a>
                <div class="d-flex justify-content-end">
                    <button type="submit"
                            class="btn btn-primary"
                            style="${() => {
                                const isDisabled = loginEmail.value === '' || loginPassword.value === '';
                                return `
                                background-color: ${isDisabled ? 'transparent' : 'var(--primary-color)'};
                                border-color: var(--primary-color);
                                color: ${isDisabled ? 'var(--primary-color)' : '#fff'};
                            `;
                            }}"
                            ?disabled=${() => loginEmail.value === '' || loginPassword.value === ''}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    </div>
  `;
};
