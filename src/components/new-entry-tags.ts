import { html, signal, Tina4Element } from "tina4js";
import TagsData from "../database/tags.json";
import { selectedTags } from "../state/new-entry-state";

export class NewEntryTags extends Tina4Element {
    static shadow = false;

    showModal = signal<boolean>(false, 'showModal');

    private toggleTag(id: string) {
        selectedTags.value = selectedTags.value.includes(id)
            ? selectedTags.value.filter(t => t !== id)
            : [...selectedTags.value, id];
    }

    private renderModalTag(id: string, name: string, bg_color: string, text_color: string) {
        return html`
            <button type="button"
                    style="${() => `
                    background-color: ${bg_color};
                    color: ${text_color};
                    display: ${selectedTags.value.includes(id) ? 'none' : 'inline-block'};
                    border: 1px solid ${text_color};
                    border-radius: 15px;
                    padding: 2px 15px;
                    cursor: pointer;
                    margin-right: 5px;
                    margin-bottom: 5px;
                `}"
                    @click=${() => this.toggleTag(id)}
            >
                ${name}
            </button>
        `;
    }

    private renderSelectedTag(id: string, name: string, bg_color: string, text_color: string) {
        return html`
            <button type="button"
                    style="${() => `
                    background-color: ${bg_color};
                    color: ${text_color};
                    display: ${selectedTags.value.includes(id) ? 'inline-block' : 'none'};
                    border: 1px solid ${text_color};
                    border-radius: 15px;
                    padding: 2px 15px;
                    cursor: pointer;
                    margin-right: 5px;
                    margin-bottom: 5px;
                `}"
                    @click=${() => this.toggleTag(id)}
            >
                ${name}
            </button>
        `;
    }

    private renderModal() {
        return html`
            <div
                class="modal-backdrop fade show"
                @click=${() => this.showModal.value = false}>
            </div>
            <div class="modal fade show" style="display: block;" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-primary">Add Tag</h5>
                            <button type="button"
                                    class="btn-close"
                                    @click=${() => this.showModal.value = false}>
                            </button>
                        </div>
                        <div class="modal-body d-flex flex-wrap">
                            ${TagsData.map(({ id, name, bg_color, text_color }) =>
                                this.renderModalTag(id, name, bg_color, text_color)
                            )}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        return html`
            <p class="text-secondary" style="margin-bottom: 0;">Tags (Optional)</p>

            ${() => this.showModal.value ? this.renderModal() : null}

            <section class="d-flex flex-wrap align-items-center justify-content-start">
                ${TagsData.map(({id, name, bg_color, text_color}) =>
                        this.renderSelectedTag(id, name, bg_color, text_color)
                )}
                <button type="button"
                        class="text-secondary"
                        style="
                            background-color: transparent;
                            border: 1px solid #888780;
                            border-radius: 15px;
                            padding: 2px 15px;
                            cursor: pointer;
                        "
                        @click=${() => this.showModal.value = true}>
                    + Add Tag
                </button>
            </section>
        `;
    }
}

customElements.define("new-entry-tags", NewEntryTags);