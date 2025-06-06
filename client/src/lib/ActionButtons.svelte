<script lang="ts">
  import { startEstimation, timerState } from "../state.svelte";
  import { cardRefsStore, currentIssueId, sessionInfo } from "../store";
  import Timer from "./Timer.svelte";
  import { revealCards } from "./utils";

  const timerText = $derived(timerState.isActive ? "Stop" : "Start");
  const issueIsRevealed = $derived($currentIssueId && $sessionInfo[$currentIssueId]);
  const estimationIsEmpty = $derived($cardRefsStore.length === 0);
</script>

<div class="flex items-center space-x-4">
  <button disabled={estimationIsEmpty || issueIsRevealed} onclick={startEstimation} class="px-4 py-2 bg-[var(--color-bg)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text)] rounded-md transition">{timerText} Estimation</button>
  <Timer />
  <button disabled={estimationIsEmpty || issueIsRevealed} onclick={revealCards} class="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-md transition">Reveal Cards</button>
</div>