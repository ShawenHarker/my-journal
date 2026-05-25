import { html, Tina4Element, signal, effect } from 'tina4js';
import { successMessage, errorMessage } from '../state/global-state';

export class ShowToastMessage extends Tina4Element {
    private dismissTimer: ReturnType<typeof setTimeout> | null = null;

    message = signal('');

    constructor() {
        super();

        effect(() => {
            this.message.value =
                successMessage.value !== '' && errorMessage.value === ''
                    ? successMessage.value
                    : errorMessage.value;

            if (this.message.value !== '') {
                if (this.dismissTimer) {
                    clearTimeout(this.dismissTimer);
                }

                this.dismissTimer = setTimeout(() => {
                    this.handleDismiss();
                }, 5000);
            }
        });
    }

    handleDismiss = () => {
        successMessage.value = '';
        errorMessage.value = '';
        this.message.value = '';

        if (this.dismissTimer) {
            clearTimeout(this.dismissTimer);
            this.dismissTimer = null;
        }
    };

    onUnmount() {
        if (this.dismissTimer) {
            clearTimeout(this.dismissTimer);
        }
    }

    render() {
        return html`
            ${() =>
            this.message.value !== ''
                ? html`
                    <div
                        class="toast-body d-flex justify-content-between align-items-center"
                        style="${() => {
                            const isSuccess = successMessage.value !== '' && errorMessage.value === '';
                            return `
                                position: fixed;
                                top: 20px;
                                right: 20px;
                                z-index: 1050;
                                background-color: ${isSuccess ? 'var(--color-success)' : 'var(--color-danger)'};
                                color: #FFFFFF;
                                padding: 5px 10px;
                                border-radius: var(--radius-sm);
                            `;
                        }}"
                    >
                        <span style="flex: 1">${this.message}</span>
                        <button type="button"
                                aria-label="Close"
                                style="
                                    border: none;
                                    background: transparent;
                                    color: #FFFFFF;
                                    cursor: pointer;
                                    margin-left: 10px;
                                "
                                @click=${this.handleDismiss}
                            >
                                ✕
                            </button>
                        </div>
            ` : null}
        `;
    }
}

customElements.define('show-toast-message', ShowToastMessage);