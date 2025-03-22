import { apiClient } from "./apiClient";

export const testIntegration = async (data: any) => {
    return apiClient("POST", `/integration/test`, data, {credentials: 'include'});
}