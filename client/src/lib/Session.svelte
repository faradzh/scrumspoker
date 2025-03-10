<script lang="ts">
  import { storiesState } from "../state.svelte";
  import { cardRefsStore, selectedCards, sessionInfo } from "../store";
  import CurrentEstimates from "./CurrentEstimates.svelte";
  import Timer from "./Timer.svelte";
  import TotalEstimate from "./TotalEstimate.svelte";
  import { reEstimateHandler, revealCards } from "./utils";

  function revealIsDisabled() {
    if ($cardRefsStore.length === 0) {
        return true;
    }
    return $sessionInfo?.estimationIsRevealed;
  }

  const currentStoryText = $derived(storiesState.selectedStory ? (storiesState.selectedStory?.key + ": " + storiesState.selectedStory?.summary) : '');
</script>

<section class="relative lg:row-span-2 lg-col-span-3 text-black">
    <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
    <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
        <div class="p-6">
            <div class="mb-6">
                <h2 class="text-xl font-semibold text-gray-950">Current Estimation</h2>
                <p class="text-gray-600 dark:text-gray-300">{currentStoryText}</p>
            </div>
            <!-- <div class=""> -->
            <CurrentEstimates />
                <!-- <div class="relative flex justify-around mb-4">
                    <Timer />
                    <TotalEstimate />
                </div> -->
                <!-- <div class="flex justify-between">
                    <button onclick={revealCards} class={`btn btn-sm`}>Reveal</button>
                    <button onclick={reEstimateHandler} class="btn btn-sm">Re-estimate</button>
                    <button class="btn btn-accent btn-sm">Save</button>
                </div> -->
            <!-- </div> -->
        </div>
    </div>
    <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
</section>