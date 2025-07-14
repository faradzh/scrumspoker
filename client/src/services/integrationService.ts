import { apiClient } from "./apiClient";

export const testIntegration = async (data: any) => {
  return apiClient("POST", `/integrations/test`, data, {
    credentials: "include",
  });
};

export const fetchIntegrationConfig = async (data: any) => {
  return apiClient("POST", "/integrations/config", data, {
    credentials: "include",
  });
};
