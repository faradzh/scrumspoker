import { apiClient } from "./apiClient";
import ToastService from "./toastService";

export const createRoom = async (data: any) => {
  return apiClient("POST", `/rooms`, data, {
    credentials: "include",
  });
};

export const fetchRoomData = async () => {
  const roomId = location.pathname.split("/").pop();
  return apiClient("GET", `/rooms/${roomId}`, undefined, {
    credentials: "include",
  });
};

export const fetchRooms = async () => {
  return apiClient("GET", "/rooms", undefined, {
    credentials: "include",
  });
};

export const updateRoom = async (data: any) => {
  const { id } = data;
  return apiClient("PUT", `/rooms/${id}`, data, {
    credentials: "include",
  });
};

export const deleteRoom = async (id: string) => {
  return apiClient("DELETE", `/rooms/${id}`, undefined, {
    credentials: "include",
  });
};

export const fetchIssues = async () => {
  const roomId = location.pathname.split("/").pop();
  return apiClient("GET", `/issues?roomId=${roomId}`, undefined, {
    credentials: "include",
  });
};

export const updateIssue = async (issueId: string, value: number) => {
  const roomId = location.pathname.split("/").pop();
  try {
    await apiClient(
      "PUT",
      `/issues/${issueId}?roomId=${roomId}`,
      { value },
      { credentials: "include" }
    );
    ToastService.showToast("Estimation saved!");
  } catch (error) {
    // no-op
  }
};
