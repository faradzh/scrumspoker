import { INTEGRATION_NAMES } from "./constants";

type FormDataType = {
  name: string;
  estimationMethod: string;
  integration?: {
    id: INTEGRATION_NAMES;
    email?: string;
    apiToken?: string;
    filterLabel?: string;
    projectName?: string;
  };
};

export const INITIAL_FORM_DATA: FormDataType = {
  name: "",
  estimationMethod: "fibbonachi",
  integration: {
    id: INTEGRATION_NAMES.JIRA,
  },
};

export const formData = $state<FormDataType>(INITIAL_FORM_DATA);
export const formStateSinceLastTest = $state({ modified: true });
export const connectionState = $state<any>({});
