import { TIMER_INIT } from "./constants";

export const timerState = $state<{
  value: number;
  interval: number | undefined;
  isActive: boolean;
}>({ value: TIMER_INIT, interval: undefined, isActive: false });

function setTimerInterval() {
  timerState.isActive = true;
  timerState.value--;

  if (timerState.value <= 0) {
    timerState.isActive = false;
    clearInterval(timerState.interval);
  }
}

export function updateTimer() {
  if (timerState.isActive) {
    clearInterval(timerState.interval);
    timerState.isActive = false;
    return;
  }
  setTimerInterval();
  timerState.interval = setInterval(setTimerInterval, 1000);
}

function resetTimer() {
  timerState.value = TIMER_INIT;
  clearInterval(timerState.interval);
}

export const storiesState = $state<{
  selectedStory: { id: string; summary: string; key: string } | undefined;
}>({ selectedStory: undefined });

export type Toast = {
  message: string;
  type: "error" | "success";
};
export const toastState = $state<{ messages: Toast[] }>({ messages: [] });
