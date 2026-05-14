import { html, Tina4Element } from 'tina4js';

export class HorizontalTabs extends Tina4Element {
    static props = {
        activePath: String,
    };

    static shadow = false;

    render() {
        const tabs = [
            { icon: 'bi bi-pencil', href: '/new-entry', text: 'New Entry' },
            { icon: 'bi bi-book', href: '/my-journal', text: 'My Journal' },
        ];

        const tabClass = (href: string) =>
            `nav-item ${this.prop('activePath').value === href ? 'primary-bg' : ''} d-flex align-items-center rounded-top-2 px-2 me-2`.trim();

        return html`
            <ul class="nav nav-tabs text-primary-brand">
                ${tabs.map(tab => html`
                    <li class="${tabClass(tab.href)}">
                        <i class="${tab.icon}" style="margin-top: 4px;"></i>
                        <a class="nav-link px-2 text-primary-brand" href="${tab.href}">${tab.text}</a>
                    </li>
                `)}
            </ul>
        `;
    }
}

customElements.define('horizontal-tabs', HorizontalTabs);