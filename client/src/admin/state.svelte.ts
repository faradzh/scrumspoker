import { INTEGRATION_NAMES } from "./constants";

type FormDataType = {
  name: string;
  estimationMethod: string;
  integration: {
    id: INTEGRATION_NAMES;
    email?: string;
    apiToken?: string;
    filterLabel?: string;
    projectName?: string;
    resourceId?: string;
    resourceUrl?: string;
    fieldId?: string;
  };
};

export const INITIAL_FORM_DATA: FormDataType = {
  name: "",
  estimationMethod: "fibbonachi",
  integration: {
    id: INTEGRATION_NAMES.JIRA,
  },
};

type FormSelectData = {
  resources: { id: string; url: string }[];
  fields: { id: string; name: string }[];
};
export const formData = $state<FormDataType>(INITIAL_FORM_DATA);
export const formSelectData = $state<FormSelectData>({
  resources: [],
  fields: [],
});
export const formStateSinceLastTest = $state({ modified: true });
export const connectionState = $state<any>({});

export function resetFormData() {
  formData.name = INITIAL_FORM_DATA.name;
  formData.estimationMethod = INITIAL_FORM_DATA.estimationMethod;
  formData.integration = INITIAL_FORM_DATA.integration;
}

export function addResourceId() {
  if (formData.integration?.resourceUrl) {
    formData.integration.resourceId = formSelectData.resources.find(
      (resource) => resource.url === formData.integration?.resourceUrl
    )?.id;
  }
}
