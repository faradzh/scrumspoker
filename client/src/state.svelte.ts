import { TIMER_INIT } from "./constants";

export const timerState = $state<{value: number, interval: number | undefined}>({value: TIMER_INIT, interval: undefined});

export const storiesState = $state<{selectedStory: {id: string, summary: string, key: string} | undefined}>({selectedStory: undefined});