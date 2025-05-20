import FormService from "./FormService.svelte";
import IntegrationForm from "./IntegrationForm.svelte";
import RoomForm from "./RoomForm.svelte";

export enum FORM_BUTTONS {
  CANCEL = "Cancel",
  BACK = "Back",
  NEXT = "Next",
  CREATE = "Create",
}

export enum INTEGRATION_NAMES {
  JIRA = "JIRA",
  ASANA = "ASANA",
}

export const formService = new FormService([RoomForm, IntegrationForm]);
