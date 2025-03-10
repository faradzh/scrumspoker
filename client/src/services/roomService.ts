import { apiClient } from "./apiClient";

export const getRoomData = async () => {
    const roomId = location.pathname.split("/").pop();
    return apiClient("GET", `/rooms/${roomId}`, undefined, {headers: { 'Accept': 'application/json' }, credentials: 'include'});
}

export const fetchIssues = async () => {
    const roomId = location.pathname.split("/").pop();
    return apiClient("GET", `/issues?roomId=${roomId}`, undefined, {headers: { 'Accept': 'application/json' }, credentials: 'include'});
}