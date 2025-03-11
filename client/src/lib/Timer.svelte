<script lang="ts">
  import { onMount } from "svelte";

  import { revealCards } from "./utils";
  import { TIMER_INIT } from "../constants";
  import { timerState } from "../state.svelte";

    function resetTimer(){
        clearInterval(timerState.interval);
        timerState.value = TIMER_INIT;
        timerState.isActive = false;
    }

    $effect(() => {
        if (timerState.value <= 0) {
            resetTimer();
            revealCards();
            timerState.isActive = false;
        }
    });
    
    $effect(() => {
        if (timerState.value === TIMER_INIT) {
            timerState.isActive = false;
        }
    });

    onMount(() => {
        return () => clearInterval(timerState.interval);
    });

    const minutes = $derived(Math.floor(timerState.value / 60));
    const seconds = $derived(timerState.value % 60);
    const progress = $derived((timerState.value / TIMER_INIT) * 100);
</script>

<div class="flex items-center space-x-2">
    <div class="radial-progress mr-1" style="--value:{progress}; --size:4rem; --thickness: 2px;" aria-valuenow={progress} role="progressbar">
        <span class="countdown font-mono text-l">
            <span style="--value:{minutes};" aria-live="polite" aria-label="minutes">{minutes}</span>
            :
            <span style="--value:{seconds};" aria-live="polite" aria-label="seconds">{seconds}</span>
        </span>
    </div>
    <div class="text-lg text-gray-600 dark:text-gray-300">
        Timer
    </div>
</div>

