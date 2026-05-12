import { html } from 'tina4js';
import { HorizontalTabs } from "../components/horizontal-tabs";
import { AppHeader } from '../components/app-header';

export const NewEntry = () => {
  return html`
    ${HorizontalTabs()}
    ${AppHeader({ name: 'New Entry' })}
  `;
}
