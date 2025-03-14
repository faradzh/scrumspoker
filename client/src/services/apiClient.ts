import ToastService from "./toastService";

export const apiClient = async <T = any>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    data?: any,
    config?: RequestInit
  ): Promise<T> => {
    const baseUrl = await import.meta.env.VITE_BACKEND_URL;
  
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Accept": "application/json" 
    };
  
    const options: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...config
    };
  
    try {
      const response = await fetch(`${baseUrl}${url}`, options);
  
      if (!response.ok) {
        const errorData = await response.json();
        ToastService.showToast("API request failed", {type: "error"});
        throw new Error(errorData.message || "API request failed");
      }
  
      return (await response.json()) as T;
    } catch (error) {
      ToastService.showToast(`API Error: ${error}`, {type: "error"});
      console.error();
      throw error;
    }
  };
  