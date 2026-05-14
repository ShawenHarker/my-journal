import { html, Tina4Element } from "tina4js";
import Moods from '../database/moods.json';
import { selectedMood } from "../state/new-entry-state";

export class NewEntryMoods extends Tina4Element {
    static shadow = false;

    render() {
        return html`
            <p class="text-secondary" style="line-height: 0.2;">How are you feeling today?</p>

            ${Moods.map(mood => {
                const { id, name, emoji, bg_color, text_color } = mood;

                return html`
                    <button
                        id="${id}"
                        style="${() => `
                            color: ${text_color};
                            background-color: ${selectedMood.value === id ? bg_color : 'transparent'};
                            border: 1px solid ${text_color};
                            border-radius: 15px;
                            padding: 2px 15px;
                            cursor: pointer;
                        `}"
                        @click=${() => selectedMood.value = id}
                        @mouseenter=${(e: MouseEvent) => (e.target as HTMLElement).style.backgroundColor = bg_color}
                        @mouseleave=${(e: MouseEvent) => {
                            (e.target as HTMLElement).style.backgroundColor = 
                                    selectedMood.value === id ? bg_color : 'transparent'
                        }}
                    >
                        ${emoji} ${name}
                    </button>
                `;
            })}
        `;
    }
}

customElements.define('new-entry-moods', NewEntryMoods);