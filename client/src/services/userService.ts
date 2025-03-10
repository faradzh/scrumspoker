import { apiClient } from "./apiClient";

export const getCurrentUser = async () => {
    return apiClient("GET", "/api/current-user", undefined, {headers: { 'Accept': 'application/json' }, credentials: 'include'});
}