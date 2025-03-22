import type { INTEGRATION_NAMES } from "./constants";

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
}

export let formData = $state<FormDataType>({
    name: '',
    estimationMethod: 'fibbonachi'
});