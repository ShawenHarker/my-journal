import { html } from 'tina4js';
import '../components/app-header';
import '../components/horizontal-tabs';

export const NewEntry = () => {

  return html`
    <horizontal-tabs></horizontal-tabs>
    <app-header title='Hello World'></app-header>
  `;
}
