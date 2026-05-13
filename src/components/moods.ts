import { html } from 'tina4js';
import Moods from '../database/moods.json';

export const Mood = () => {
    return html`
    <div class="mt-2">
        ${Moods.map(mood => {
            const style = `
                color: ${mood.text_color};
                background-color: transparent;
                border: 1px solid ${mood.text_color};
                border-radius: 15px;
                padding: 4px;
                width: 10%;
                cursor: pointer;
            `;

            return html`
                <button id="${mood.id}"
                        style="${style}"
                        data-bg="${mood.bg_color}"
                        class="mood-btn"
                        onmouseenter="this.style.backgroundColor = this.getAttribute('data-bg')"
                        onmouseleave="this.style.backgroundColor = this.id === document.querySelector('.mood-btn.selected')?.id ? this.getAttribute('data-bg') : 'transparent'"
                        onclick="
                            document.querySelectorAll('.mood-btn').forEach(b => {
                                b.style.backgroundColor = 'transparent';
                                b.classList.remove('selected');
                            });
                        this.style.backgroundColor = this.getAttribute('data-bg');
                        this.classList.add('selected');
                ">
                    ${mood.name}
                </button>
            `;
        })}
    </div>
    `
}