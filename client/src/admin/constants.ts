import { QueryClient } from "@tanstack/svelte-query";

export enum FORM_BUTTONS {
    CANCEL = 'Cancel',
    BACK = 'Back',
    NEXT = 'Next',
    CREATE = 'Create Room'
}

export enum INTEGRATION_NAMES {
    JIRA = 'JIRA',
    ASANA = 'ASANA'
}

export const queryClient = new QueryClient();