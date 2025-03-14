import { toastState } from "../state.svelte";

class ToastService {
  public static showToast(message: string, options?: {type: 'error' | 'success'}) {
    toastState.messages.push({message, type: options?.type ?? 'success'});
  }
}

export default ToastService;