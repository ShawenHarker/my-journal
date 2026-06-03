import apiHandler from "./apiHandler";
import { handleError } from "../helpers/helpers";
import { errorMessage, successMessage, isValidUser } from '../state/global-state';
import { selectedMood, journalTitle, journaledText, selectedTags } from "../state/new-entry-state";

interface JournalEntry {
    mood: number;
    tags: number[];
    title: string;
    entry: string;
    draft: boolean;
}

interface EntryResponse {
    status: string;
    notification: string;
    info: {
        is_session_valid: boolean;
        mood_id: number;
        title: string;
        entry: string;
        tag_ids: number[];
    }
}

export const newEntry = async (payload: JournalEntry) => {
    try {
        const data = {
            mood_id: payload.mood,
            title: payload.title,
            entry: payload.entry,
            tag_ids: payload.tags,
            draft: payload.draft,
        }

        const response = await apiHandler('api/entries/new-entry', 'POST', data) as EntryResponse;

        if (!response) {
            errorMessage.value = 'There is an issue and our team will resolve it shortly.';
            return 'Error';
        }

        if (response.status === 'Successful') {
            successMessage.value = response.notification;

            isValidUser.value = response.info.is_session_valid;
            selectedMood.value = 0;
            selectedTags.value = [];
            journalTitle.value = '';
            journaledText.value = '';

            if (!payload.draft) {
                localStorage.setItem('draft', '');
            }

            return 'Successful';
        }

        errorMessage.value = response.notification;

        const stored = localStorage.getItem('draft');
        const { mood, tags, title, entry } = stored ? JSON.parse(stored) : { mood: 0, tags: [], title: '', entry: '' };

        selectedMood.value = mood;
        selectedTags.value = tags;
        journalTitle.value = title;
        journaledText.value = entry;

        return 'Error';
    } catch (e: unknown) {
        handleError(e);
        return 'Error';
    }
}