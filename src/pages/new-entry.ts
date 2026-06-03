import { html } from 'tina4js';
import {
    journaledText,
    selectedMood,
    selectedTags,
    journalTitle
} from '../state/new-entry-state';
import '@/components/new-entry-tags';
import '@/components/new-entry-moods';
import '@/components/new-entry-title';
import '@/components/new-entry-header';
import '@/components/new-entry-text-area';
import '@/components/submit-button';
import { user } from '../state/global-state';
import { newEntry } from "../api/entry";

export const NewEntry = () => {
    const { firstName, lastName, currentStreak } = user.value;

    const handleSubmit = async (e: Event, isDraft: boolean = false) => {
        e.preventDefault();

        const payload = {
            mood: selectedMood.value,
            tags: selectedTags.value,
            title: journalTitle.value,
            entry: journaledText.value,
            draft: isDraft,
        };

        localStorage.setItem('draft', JSON.stringify(payload));

        await newEntry(payload);
    };

    return html`
        <form @submit=${(e: Event) => handleSubmit(e, false)} method="POST" action="/entries">
            <new-entry-header
                    firstName=${firstName}
                    lastName=${lastName}
                    current_streak=${currentStreak}
                    seven_day_streak=${currentStreak}>
            </new-entry-header>
            <div class="mt-3"></div>
            <new-entry-moods></new-entry-moods>
            <div class="mt-2"></div>
            <new-entry-tags></new-entry-tags>
            <div class="mt-2"></div>
            <new-entry-title></new-entry-title>
            <new-entry-text-area></new-entry-text-area>
            <div class="mt-2 d-flex justify-content-end">
                <button type="button"
                        class="btn btn-secondary me-2"
                        style="
                            background-color: transparent;
                            border-color: var(--primary-color);
                            color: var(--primary-color);"
                        @click=${(e: Event) => handleSubmit(e, true)}>
                    Save Draft
                </button>
                <submit-button></submit-button>
            </div>
        </form>
    `;
};