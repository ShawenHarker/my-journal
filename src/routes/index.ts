import { html, route, navigate } from 'tina4js';
import  '@/components/horizontal-tabs';
import { NewEntry } from '../pages/newEntry';
import { MyJournal } from '../pages/myJournal';

const layout = (content: any, activePath: string) => html`
    <horizontal-tabs activePath="${activePath}"></horizontal-tabs>
    ${content}
`;

route('/', () => {
    setTimeout(() => navigate('/new-entry', { replace: true }), 0);
    return html``;
});

route('/new-entry', () => layout(NewEntry(), '/new-entry'));
route('/my-journal', () => layout(MyJournal(), '/my-journal'));
route('*', () => html`<h1>404 – Page not found</h1>`);