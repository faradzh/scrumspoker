<script lang="ts">
  import { onMount } from "svelte";
  import { revealCards } from "./utils";

    const TIMER = 10;

    let timer = $state(TIMER);
    let interval: number;

    let isActive = $state(false);

    function setTimerInterval() {
        isActive = true;
        timer--;

        if (timer <= 0) {
            isActive = false;
            clearInterval(interval);
        }
    }

    function updateTimer() {
        if (isActive) {
            clearInterval(interval);
            isActive = false;
            return;
        }
        setTimerInterval();
        interval = setInterval(setTimerInterval, 1000);
    }

    function resetTimer(){
        clearInterval(interval);
        timer = TIMER;
        isActive = false;
    }

    $effect(() => {
        if (timer <= 0) {
            resetTimer();
            revealCards();
        }
    });
    
    onMount(() => {
        return () => clearInterval(interval);
    });

    const timerText = $derived(isActive ? "Stop" : "Start");
</script>

<div class="bg-gray-800 rounded-box text-neutral-content flex flex-col p-2 max-w-38 mb-4">
    <h3 class="text-center">Timer</h3>
    <span class="countdown font-mono text-6xl text-center block">
        <span style="--value:{timer};"></span>
    </span>
    <div class="flex">
        <button onclick={updateTimer} class="btn btn-outline btn-sm text-white mr-2">{timerText}</button>
        <button onclick={resetTimer} class="btn btn-outline btn-sm text-white">Reset</button>
    </div>
</div>