import { html } from 'tina4js';
import { AppHeader } from '../components/app-header';

export const NewEntry = () => {
  return html`
    ${AppHeader({ name: 'New Entry' })}
  `;
}
