import { html } from 'tina4js';
import { HorizontalTabs } from "../components/horizontal-tabs";

export const MyJournal = () => {
  return html`
    ${HorizontalTabs()}
    <h1>My Journal</h1>
  `;
};
