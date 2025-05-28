<script lang="ts">
  import { onMount } from "svelte";

  import { revealCards } from "./utils";
  import { TIMER_INIT } from "../constants";
  import { resetTimer, timerState } from "../state.svelte";

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
    const minsDigitsLen = $derived(minutes.toString().length);
    
    const seconds = $derived(timerState.value % 60);
    const secsDigitsLen = $derived(seconds.toString().length);
    const progress = $derived((timerState.value / TIMER_INIT) * 100);
</script>

<div class="flex items-center space-x-2">
    <div class="radial-progress mr-1" style="--value:{progress}; --size:4rem; --thickness: 2px;" aria-valuenow={progress} role="progressbar">
        <span class="font-mono text-l">
            <span aria-live="polite" aria-label="minutes">{`${minsDigitsLen === 1 ? '0' : ''}${minutes}`}</span>:<span aria-live="polite" aria-label="seconds">{`${secsDigitsLen === 1 ? '0' : ''}${seconds}`}</span>
        </span>
    </div>
    <!-- <div class="text-lg text-gray-600">
        Timer
    </div> -->
</div>

