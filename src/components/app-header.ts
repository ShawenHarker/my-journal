import { html } from 'tina4js';

export const AppHeader = ({ name }: { name: string }) => {
  return html`<h1>${name}!</h1>`;
};
