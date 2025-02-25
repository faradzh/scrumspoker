import { TIMER_INIT } from "./constants";

export const timerState = $state<{value: number, interval: number | undefined}>({value: TIMER_INIT, interval: undefined});