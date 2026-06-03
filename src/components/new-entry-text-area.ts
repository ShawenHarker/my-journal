import { html, Tina4Element } from 'tina4js';
import PromptsData from '../database/prompts.json';
import { journaledText } from '../state/new-entry-state';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';

export class NewEntryTextArea extends Tina4Element {
    static shadow = false;

    private randomPrompt = '';
    private isBold = false;
    private isItalic = false;
    private isStrike = false;
    private isUnderline = false;
    private isBulletList = false;
    private isOrderList = false;
    private isAlignLeft = true;
    private isAlignCenter = false;
    private isAlignRight = false;
    private isAlignJust = false;

    editor: Editor | null = null;

    private syncState() {
        if (!this.editor) return;
        this.isBold = this.editor.isActive('bold');
        this.isItalic = this.editor.isActive('italic');
        this.isStrike = this.editor.isActive('strike');
        this.isUnderline = this.editor.isActive('underline');
        this.isBulletList = this.editor.isActive('bulletList');
        this.isOrderList = this.editor.isActive('orderedList');
        this.isAlignLeft = this.editor.isActive({ textAlign: 'left' });
        this.isAlignCenter = this.editor.isActive({ textAlign: 'center' });
        this.isAlignRight = this.editor.isActive({ textAlign: 'right' });
        this.isAlignJust = this.editor.isActive({ textAlign: 'justify' });

        this.updateToolbarState();
    }

    private updateToolbarState() {
        const map: Record<string, boolean> = {
            'btn-bold': this.isBold,
            'btn-italic': this.isItalic,
            'btn-strike': this.isStrike,
            'btn-underline': this.isUnderline,
            'btn-bullet': this.isBulletList,
            'btn-ordered': this.isOrderList,
            'btn-align-left': this.isAlignLeft,
            'btn-align-center': this.isAlignCenter,
            'btn-align-right': this.isAlignRight,
            'btn-align-just': this.isAlignJust,
        };

        for (const [id, active] of Object.entries(map)) {
            const el = this.querySelector(`#${id}`);
            if (el) el.classList.toggle('is-active', active);
        }
    }

    private getRandomPrompt() {
        const prompt: { id: number; prompt: string } = PromptsData[Math.floor(Math.random() * PromptsData.length)];
        this.randomPrompt = prompt.prompt;

        if (this.editor) {
            this.editor.extensionManager.extensions.forEach((ext: any) => {
                if (ext.name === 'placeholder') {
                    ext.options.placeholder = this.randomPrompt;
                }
            });

            this.editor.view.dispatch(this.editor.view.state.tr);
        }
    }

    async handleImageUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const base64 = reader.result as string;
            this.editor?.chain().focus().setImage({ src: base64, alt: file.name }).run();
        };

        reader.readAsDataURL(file);
        input.value = '';
    }

    onMount() {
        this.getRandomPrompt();

        const editorElement = this.querySelector('#editor');
        if (!editorElement) return;

        this.editor = new Editor({
            element: editorElement,
            extensions: [
                StarterKit,
                Underline,
                Superscript,
                Subscript,
                Link.configure({ openOnClick: false }),
                TextAlign.configure({ types: ['heading', 'paragraph'] }),
                Image.configure({ inline: false, allowBase64: true }),
                Placeholder.configure({
                    placeholder: () => this.randomPrompt,
                    emptyEditorClass: 'is-editor-empty',
                }),
            ],
            content: '',
            editorProps: { attributes: { class: 'journal-editor' } },
            onUpdate: ({ editor }) => {
                journaledText.value = editor.getHTML();
                this.syncState();
            },
            onSelectionUpdate: () => {
                this.syncState();
            },
        });
    }

    onUnmount() {
        this.editor?.destroy();
    }

    private divider() {
        return html`
            <div style="
                    width: 1px; height: 18px;
                    background: var(--border-color);
                    margin: 0 3px; flex-shrink: 0;
                "
            ></div>`;
    }

    render() {
        return html`
            <div style="position: relative; width: 100%;">
                <div style="
                        display: flex; align-items: center; gap: 1px;
                        flex-wrap: wrap; padding: 5px 8px;
                        border: 1px solid var(--primary-color, #534AB7);
                        border-bottom: none;
                        border-radius: var(--radius-md, 8px) var(--radius-md, 8px) 0 0;
                        background-color: transparent; row-gap: 4px;
                    "
                >
                    <button id="btn-undo"
                            type="button"
                            title="Undo" 
                            class="toolbar-btn"
                            @click=${() => this.editor?.chain().focus().undo().run()}>
                        <i class="bi bi-arrow-counterclockwise"></i>
                    </button>
                    <button id="btn-redo"
                            type="button"
                            title="Redo"
                            class="toolbar-btn"
                            @click=${() => this.editor?.chain().focus().redo().run()}>
                        <i class="bi bi-arrow-clockwise"></i>
                    </button>
                    ${this.divider()}
                    <select class="toolbar-select" 
                            title="Text style"
                            @change=${(ev: Event) => {
                                const val = (ev.target as HTMLSelectElement).value;
                                if (val === 'p') this.editor?.chain().focus().setParagraph().run();
                                else this.editor?.chain().focus().setHeading({ level: parseInt(val) as 1|2|3 }).run();
                            }}
                    >
                        <option value="p">P</option>
                        <option value="1">H1</option>
                        <option value="2">H2</option>
                        <option value="3">H3</option>
                    </select>
                    ${this.divider()}
                    <button id="btn-bullet"
                            type="button"
                            title="Bullet list"
                            class="toolbar-btn"
                            @click=${() => this.editor?.chain().focus().toggleBulletList().run()}>
                        <i class="bi bi-list-ul"></i>
                    </button>
                    <button id="btn-ordered"
                            type="button"
                            title="Ordered list"
                            class="toolbar-btn"
                            @click=${() => this.editor?.chain().focus().toggleOrderedList().run()}>
                        <i class="bi bi-list-ol"></i>
                    </button>
                    <button id="btn-indent"
                            type="button"
                            title="Indent"
                            class="toolbar-btn"
                            @click=${() => this.editor?.chain().focus().sinkListItem('listItem').run()}>
                        <i class="bi bi-text-indent"></i>
                    </button>
                    <button id="btn-outdent"
                            type="button" title="Outdent"
                            class="toolbar-btn"
                            @click=${() => this.editor?.chain().focus().liftListItem('listItem').run()}>
                        <i class="bi bi-text-outdent"></i>
                    </button>
                    ${this.divider()}
                    <button id="btn-bold"
                            type="button" title="Bold"
                            class="toolbar-btn"
                            @click=${() => this.editor?.chain().focus().toggleBold().run()}>
                        <i class="bi bi-type-bold"></i>
                    </button>
                    <button id="btn-italic"
                            type="button"
                            title="Italic"
                            class="toolbar-btn" 
                            @click=${() => this.editor?.chain().focus().toggleItalic().run()}>
                        <i class="bi bi-type-italic"></i>
                    </button>
                    <button id="btn-strike"
                            type="button"
                            title="Strikethrough"
                            class="toolbar-btn"
                            @click=${() => this.editor?.chain().focus().toggleStrike().run()}>
                        <i class="bi bi-type-strikethrough"></i>
                    </button>
                    <button id="btn-underline"
                            type="button"
                            title="Underline"
                            class="toolbar-btn"
                            @click=${() => this.editor?.chain().focus().toggleUnderline().run()}>
                        <i class="bi bi-type-underline"></i>
                    </button>
                    <button id="btn-clear"
                            type="button"
                            title="Clear formatting"
                            class="toolbar-btn"
                            @click=${() => this.editor?.chain().focus().clearNodes().unsetAllMarks().run()}>
                        <i class="bi bi-eraser"></i>
                    </button>
                    <button id="btn-link"
                            type="button"
                            title="Add link"
                            class="toolbar-btn" 
                            @click=${() => {
                                const url = prompt('Enter URL');
                                if (url) this.editor?.chain().focus().setLink({ href: url }).run();
                            }}>
                        <i class="bi bi-link-45deg"></i>
                    </button>
                    ${this.divider()}
                    <button id="btn-super" 
                            type="button" 
                            title="Superscript"
                            class="toolbar-btn" 
                            @click=${() => this.editor?.chain().focus().toggleSuperscript().run()}>
                        <i class="bi bi-superscript"></i>
                    </button>
                    <button id="btn-sub"
                            type="button"
                            title="Subscript"
                            class="toolbar-btn"
                            @click=${() => this.editor?.chain().focus().toggleSubscript().run()}>
                        <i class="bi bi-subscript"></i>
                    </button>
                    ${this.divider()}
                    <button id="btn-align-left"
                            type="button" 
                            title="Align left"
                            class="toolbar-btn is-active"
                            @click=${() => this.editor?.chain().focus().setTextAlign('left').run()}>
                        <i class="bi bi-text-left"></i>
                    </button>
                    <button id="btn-align-center"
                            type="button"
                            title="Align center"
                            class="toolbar-btn"
                            @click=${() => this.editor?.chain().focus().setTextAlign('center').run()}>
                        <i class="bi bi-text-center"></i>
                    </button>
                    <button id="btn-align-right" 
                            type="button"
                            title="Align right"
                            class="toolbar-btn"
                            @click=${() => this.editor?.chain().focus().setTextAlign('right').run()}>
                        <i class="bi bi-text-right"></i>
                    </button>
                    <button id="btn-align-just"
                            type="button"
                            title="Justify"
                            class="toolbar-btn"
                            @click=${() => this.editor?.chain().focus().setTextAlign('justify').run()}>
                        <i class="bi bi-justify"></i>
                    </button>
                    ${this.divider()}
                    <label class="toolbar-btn" title="Upload image" style="cursor: pointer;">
                        <i class="bi bi-image"></i>
                        <input type="file" 
                               accept="image/*" 
                               style="display: none;"
                               @change=${this.handleImageUpload.bind(this)} />
                    </label>
                    <button type="button" 
                            class="toolbar-btn" 
                            style="
                                margin-left: auto;
                            "
                            title="New writing prompt"
                            @click=${() => this.getRandomPrompt()}>
                        <i class="bi bi-arrow-repeat"></i> Prompt
                    </button>
                </div>
                <div class="editor-resize-wrapper">
                    <div id="editor" 
                         style="
                            width: 100%;
                            height: 100%;
                            background-color: transparent;
                            color: var(--text-primary);
                            outline: none;
                            overflow-wrap: break-word;
                         "
                    ></div>
                </div>
            </div>
        `;
    }
}

customElements.define('new-entry-text-area', NewEntryTextArea);