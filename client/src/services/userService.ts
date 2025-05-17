import { apiClient } from "./apiClient";

export const fetchCurrentUser = async () => {
  return apiClient("GET", "/api/current-user", undefined, {
    headers: { Accept: "application/json" },
    credentials: "include",
  });
};

export const logout = async () => {
  return apiClient("POST", "/logout", undefined, {
    headers: { Accept: "application/json" },
    credentials: "include",
  });
};
