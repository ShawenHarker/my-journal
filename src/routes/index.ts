import { html, route, navigate, computed } from 'tina4js';
import '@/components/horizontal-tabs';
import '@/components/show-toast-message';
import { Login } from '../pages/login';
import { NewEntry } from '../pages/new-entry';
import { MyJournal } from '../pages/my-journal';
import { ForgotPassword } from '../pages/forgot-password';
import { RegisterNewUser } from '../pages/register-new-user';
import { isValidUser } from '../state/global-state';

const layout = (content: any, activePath: string) => html`
    <horizontal-tabs activePath="${activePath}"></horizontal-tabs>
    <show-toast-message></show-toast-message>
    ${content}
`;

const isLoggedIn = computed(() => isValidUser.value === true);

route('/', () => {
    setTimeout(() => {
        navigate(isLoggedIn.value ? '/new-entry' : '/login', { replace: true });
    }, 0);
    return html``;
});

route('/login', () => {
    if (isLoggedIn.value) {
        setTimeout(() => navigate('/new-entry', { replace: true }), 0);
        return html``;
    }
    return Login();
});

route('/register-new-user', RegisterNewUser);
route('/forgot-password', ForgotPassword);

route('/new-entry', {
    guard: () => isLoggedIn.value || '/login',
    handler: () => layout(NewEntry(), '/new-entry')
});

route('/my-journal', {
    guard: () => isLoggedIn.value || '/login',
    handler: () => layout(MyJournal(), '/my-journal')
});

route('*', () => html`<h1>404 – Page not found</h1>`);