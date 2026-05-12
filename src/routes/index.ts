import { html, route, navigate } from 'tina4js';
import { NewEntry } from '../pages/newEntry';
import { MyJournal } from '../pages/myJournal';

route('/', () => {
    navigate('/new-entry', {replace: true});
    return html``;
});

route('/new-entry', NewEntry);
route('/my-journal', MyJournal);
route('*', () => html`<h1>404 – Page not found</h1>`);
