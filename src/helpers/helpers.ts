import { errorMessage } from "../state/global-state";

export const setErrorMessage = (message: string) => {
    errorMessage.value = message;
    setTimeout(() => {
        errorMessage.value = '';
    }, 3000);
}