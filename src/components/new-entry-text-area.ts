import { html, signal, Tina4Element } from "tina4js";
import PromptsData from "../database/prompts.json";
import { journaledText } from "../state/new-entry-state";

export class NewEntryTextArea extends Tina4Element {
    static shadow = false;

    randomPrompt = signal<string>('');

    private getRandomPrompt() {
        const prompt: { id: string, prompt: string } = PromptsData[Math.floor(Math.random() * PromptsData.length)];
        this.randomPrompt.value = prompt.prompt;
    }

    render () {
        this.getRandomPrompt();

        const style = `
            width: 100%;
            min-height: 30vh;
            background-color: transparent;
            border: 1px solid var(--primary-color);
            color: var(--text-primary);
            border-radius: var(--radius-md);
            padding: 5px;
            padding-bottom: 40px;
        `;

        return html`
            <div style="position: relative; display: inline-block; width: 100%;">
                <textarea style="${style}"
                          placeholder="${this.randomPrompt.value}"
                          @input=${(e: Event) => journaledText.value = (e.target as HTMLTextAreaElement).value}
                          required
                ></textarea>
                <button type="button"
                        style="
                            position: absolute;
                            bottom: 15px;
                            left: 8px;
                            cursor: pointer;
                            background-color: transparent;
                            border: 1px solid var(--primary-color);
                            color: var(--primary-color);
                            border-radius: 15px;
                            padding: 2px 15px;
                        "
                        @click=${() => this.getRandomPrompt()}
                >
                    <i class="bi bi-arrow-repeat text-primary"></i>
                    Prompt
                </button>
            </div>
        `
    }
}

customElements.define("new-entry-text-area", NewEntryTextArea);
