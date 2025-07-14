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

export function addCloudId() {
  if (formData.integration?.resourceUrl) {
    formData.integration.resourceId = formSelectData.resources.find(
      (resource) => resource.url === formData.integration?.resourceUrl
    )?.id;
  }
}
