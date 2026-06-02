import { html, Tina4Element } from 'tina4js';
import { journaledText, selectedMood, journalTitle } from '../state/new-entry-state';

export class SubmitButton extends Tina4Element {
    static shadow = false;

    render() {
        const isDisabled = journaledText.value === '' || selectedMood.value === '' || journalTitle.value === '';
        const submitStyle = `
            background-color: ${isDisabled ? 'transparent' : 'var(--primary-color)'};
            border-color: var(--primary-color);
            color: ${isDisabled ? 'var(--primary-color)' : '#fff'};
        `;

        return html`
            <button type="submit"
                    class="btn btn-primary"
                    style="${submitStyle}"
                    ?disabled="${isDisabled}">
                Submit
            </button>
        `;
    }
}

customElements.define('submit-button', SubmitButton);