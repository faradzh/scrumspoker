import { apiClient } from "./apiClient";
import ToastService from "./toastService";

export const getRoomData = async () => {
  const roomId = location.pathname.split("/").pop();
  return apiClient("GET", `/rooms/${roomId}`, undefined, {
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
