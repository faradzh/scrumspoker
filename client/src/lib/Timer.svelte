<script lang="ts">
  import { onMount } from "svelte";
  import { revealCards } from "./utils";
  import { timer } from "../store";
  import { TIMER_INIT } from "../constants";

    let isActive = $state(false);

    function setTimerInterval() {
        isActive = true;
        $timer.value--;

        if ($timer.value <= 0) {
            isActive = false;
            clearInterval($timer.interval);
        }
    }

    function updateTimer() {
        if (isActive) {
            clearInterval($timer.interval);
            isActive = false;
            return;
        }
        setTimerInterval();
        $timer.interval = setInterval(setTimerInterval, 1000);
    }

    function resetTimer(){
        clearInterval($timer.interval);
        $timer.value = TIMER_INIT;
        isActive = false;
    }

    $effect(() => {
        if ($timer.value <= 0) {
            resetTimer();
            revealCards();
            isActive = false;
        }
    });
    
    $effect(() => {
        if ($timer.value === TIMER_INIT) {
            isActive = false;
        }
    });

    onMount(() => {
        return () => clearInterval($timer.interval);
    });

    const timerText = $derived(isActive ? "Stop" : "Start");
</script>

<div class="bg-gray-800 rounded-box text-neutral-content flex flex-col p-2 max-w-38 mb-4">
    <h3 class="text-center">Timer</h3>
    <span class="countdown font-mono text-6xl text-center block">
        <span style="--value:{$timer.value};"></span>
    </span>
    <div class="flex">
        <button onclick={updateTimer} class="btn btn-outline btn-sm text-white mr-2">{timerText}</button>
        <button onclick={resetTimer} class="btn btn-outline btn-sm text-white">Reset</button>
    </div>
</div>