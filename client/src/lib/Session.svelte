<script lang="ts">
  import { onMount } from "svelte";
  import { storiesState } from "../state.svelte";
  import { cardRefsStore, selectedCards, sessionInfo, totalEstimate } from "../store";
  import ActionButtons from "./ActionButtons.svelte";
  import CurrentEstimates from "./CurrentEstimates.svelte";
  import Timer from "./Timer.svelte";
  import TotalEstimate from "./TotalEstimate.svelte";
  import { calculateAverage } from "./utils";
  import { get } from "svelte/store";
  
  const isEnabled = $derived.by(() => {
    const total = calculateAverage($selectedCards) || 0;
    totalEstimate.set(total);
    return total > 0 && $sessionInfo.estimationIsRevealed && $sessionInfo.cardsAreFlipped;
  });

  const currentStoryText = $derived(storiesState.selectedStory ? (storiesState.selectedStory?.key + ": " + storiesState.selectedStory?.summary) : '');
</script>

<section class="relative text-black">
    <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
    <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
        <div class="p-4 h-full">
            <div class="mb-6">
                <div class="flex justify-between">
                    <div>
                        <h2 class="text-xl font-semibold text-gray-950">Current Estimation</h2>
                        <p class="text-gray-600 dark:text-gray-300">{currentStoryText}</p>
                    </div>
                    <div class="flex items-center space-x-4 mt-4 md:mt-0">
                        <Timer />
                        <ActionButtons />
                    </div>
                </div>
            </div>
            <CurrentEstimates />
            {#if isEnabled}
                <TotalEstimate />
            {/if}
        </div>
    </div>
    <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
</section>