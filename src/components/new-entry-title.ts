import { html, Tina4Element } from "tina4js";
import { journalTitle } from "../state/new-entry-state";

export class NewEntryTitle extends Tina4Element {
    render() {
        return html`
            <input placeholder="Title"
                   style="
                        width: 50%;
                        background-color: transparent;
                        border: 1px solid var(--primary-color);
                        border-radius: var(--radius-md);
                        margin-bottom: 1rem;
                        padding: 8px;
                    "
                   type="text"
                   @input=${(e: Event) => journalTitle.value = (e.target as HTMLInputElement).value}> 
        `
    }
}

customElements.define('new-entry-title', NewEntryTitle);