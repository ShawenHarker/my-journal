import { html } from 'tina4js';
import '../components/app-header';

export function homePage() {

  return html`
    <app-header title='Hello World'></app-header>
  `;
}
