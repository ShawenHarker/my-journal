import { html } from 'tina4js';

export const HorizontalTabs = (activePath: string) => {
    const tabs = [
        { icon: 'bi bi-pencil', href: '/new-entry', text: 'New Entry' },
        { icon: 'bi bi-book', href: '/my-journal', text: 'My Journal' },
    ];

    const tabClass = (href: string) =>
        `nav-item ${activePath === href ? 'primary-bg' : ''} d-flex align-items-center rounded-top-2 px-2 me-2`.trim();

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