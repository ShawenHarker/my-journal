import { Tina4Element, html } from 'tina4js';

class AppHeader extends Tina4Element {
  static props = { title: String };

  render() {
    return html`
        <h1>${this.prop('title')}!</h1>
    `;
  }
}

customElements.define('app-header', AppHeader);
