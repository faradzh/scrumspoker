<script lang="ts">
  import { startEstimation, timerState } from "../state.svelte";
  import { revealCards } from "./utils";

    const timerText = $derived(timerState.isActive ? "Stop" : "Start");
</script>

<button onclick={startEstimation} class="px-4 py-2 bg-[var(--color-bg)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text)] rounded-md transition">{timerText} Estimation</button>
<button onclick={revealCards} class="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-md transition">Reveal Cards</button>