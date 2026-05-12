import { html, route, navigate } from 'tina4js';
import { NewEntry } from '../pages/newEntry';
import { MyJournal } from '../pages/myJournal';

route('/', () => {
    setTimeout(() => navigate('/new-entry', { replace: true }), 0);
    return html``;
});

route('/new-entry', NewEntry);
route('/my-journal', MyJournal);
route('*', () => html`<h1>404 – Page not found</h1>`);
