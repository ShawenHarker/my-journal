import { html } from 'tina4js';
import {
  journaledText,
  selectedMood,
  selectedTags
} from '../state/new-entry-state';
import '@/components/new-entry-tags';
import '@/components/new-entry-moods';
import '@/components/new-entry-header';
import '@/components/new-entry-text-area';
import Users from '../database/users.json';

const DRAFT_KEY = 'journal_draft';

export const NewEntry = () => {
  const user = Users[Math.floor(Math.random() * Users.length)];
  const { name, current_streak, seven_day_streak } = user;

  const savedDraft = localStorage.getItem(DRAFT_KEY);
  if (savedDraft) {
    const draft = JSON.parse(savedDraft);
    selectedMood.value = draft.mood ?? '';
    selectedTags.value = draft.tags ?? [];
    journaledText.value = draft.text ?? '';
  }

  const buildPayload = () => ({
    mood: selectedMood.value,
    tags: selectedTags.value,
    text: journaledText.value,
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const payload = buildPayload();
    console.log('Submitting:', payload);
    localStorage.removeItem(DRAFT_KEY);
    // Todo: Implement API call
    // await api.post('/entries', payload);
  };

  const handleSaveDraft = () => {
    const payload = buildPayload();
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
    console.log('Draft saved:', payload);
  };

  return html`
    <form class="container" @submit=${handleSubmit} method="POST" action="/entries">
      <new-entry-header
          name=${name}
          current_streak=${current_streak}
          seven_day_streak=${seven_day_streak}>
      </new-entry-header>
      <div class="mt-3"></div>
      <new-entry-moods></new-entry-moods>
      <div class="mt-2"></div>
      <new-entry-tags></new-entry-tags>
      <div class="mt-2"></div>
      <new-entry-text-area></new-entry-text-area>
      <div class="mt-2 d-flex justify-content-end">
        <button type="button"
                class="btn btn-secondary me-2"
                style="
                    background-color: transparent;
                    border-color: var(--primary-color);
                    color: var(--primary-color);"
                @click=${handleSaveDraft}>
          Save Draft
        </button>
        <button type="submit" class="btn btn-primary">Submit</button>
      </div>
    </form>
  `;
}