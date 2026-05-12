import { html } from 'tina4js';

export const HorizontalTabs = () => {
    return html`
        <ul class="nav nav-tabs">
            <li class="nav-item w-25 d-flex align-items-center rounded-top-2 px-2 me-2">
                <i class="bi bi-pencil"></i>
                <a class="nav-link px-2" href="/new-entry">New Entry</a>
            </li>
            <li class="nav-item w-25 d-flex align-items-center rounded-top-2 px-2">
                <i class="bi bi-book" style="margin-top: 5px;"></i>
                <a class="nav-link px-2" href="/my-journal">My Journal</a>
            </li>
        </ul>
    `;
}
