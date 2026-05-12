import { Tina4Element, html } from 'tina4js';

class HorizontalTabs extends Tina4Element {
    render() {
        return html`
            <div></div>
        `;
    }
}

customElements.define('horizontal-tabs', HorizontalTabs);
