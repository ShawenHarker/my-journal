import { html, route, navigate } from 'tina4js';
import  '@/components/horizontal-tabs';
import { Login } from '../pages/login';
import { NewEntry } from '../pages/new-entry';
import { MyJournal } from '../pages/my-journal';
import { ForgotPassword } from "../pages/forgot-password";
import { RegisterNewUser } from '../pages/register-new-user';

const layout = (content: any, activePath: string) => html`
    <horizontal-tabs activePath="${activePath}"></horizontal-tabs>
    ${content}
`;

route('/', () => {
    setTimeout(() => navigate('/login', { replace: true }), 0);
    return html``;
});

route('/login', Login);
route('/register-new-user', RegisterNewUser);
route('/forgot-password', ForgotPassword);
route('/new-entry', () => layout(NewEntry(), '/new-entry'));
route('/my-journal', () => layout(MyJournal(), '/my-journal'));
route('*', () => html`<h1>404 – Page not found</h1>`);