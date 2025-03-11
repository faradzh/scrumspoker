<script lang="ts">
  import { timerState, updateTimer } from "../state.svelte";
  import { revealCards } from "./utils";

    const timerText = $derived(timerState.isActive ? "Stop" : "Start");
</script>

<button onclick={updateTimer} class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition">{timerText} Estimation</button>
<button onclick={revealCards} class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition">Reveal Cards</button>