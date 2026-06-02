import apiHandler from "./apiHandler";
import { handleError } from "../helpers/helpers";
import { errorMessage, successMessage } from '../state/global-state';
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
        mood: number;
        title: string;
        entry: string;
        tags: number[];
    }
}

export const newEntry = async (payload: JournalEntry) => {
    try {
        const response = await apiHandler('api/entries/new-entry', 'POST', payload) as EntryResponse;

        if (response.status === 'Successful') {
            successMessage.value = response.notification;

            const { mood, tags, title, entry } = response.info;

            selectedMood.value = mood;
            selectedTags.value = tags;
            journalTitle.value = title;
            journaledText.value = entry;

            localStorage.setItem('draft', '');

            return;
        }

        errorMessage.value = response.notification;

        const stored = localStorage.getItem('draft');
        const { mood, tags, title, entry } = stored ? JSON.parse(stored) : { mood: '', tags: [], title: '', entry: '' };

        selectedMood.value = mood;
        selectedTags.value = tags;
        journalTitle.value = title;
        journaledText.value = entry;

        return;
    } catch (e: unknown) {
        handleError(e);
        return 'Error';
    }
}