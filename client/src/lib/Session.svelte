<script lang="ts">
  import { cardRefsStore, selectedCards, sessionInfo } from "../store";
  import Participants from "./Participants.svelte";
  import Timer from "./Timer.svelte";
  import TotalEstimate from "./TotalEstimate.svelte";
  import { reEstimateHandler, revealCards } from "./utils";

  function revealIsDisabled() {
    if ($cardRefsStore.length === 0) {
        return true;
    }
    return $sessionInfo?.estimationIsRevealed;
  }
</script>

<section class="relative lg:row-span-2 text-black">
    <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
    <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
        <div class="px-8 pt-4 sm:px-8">
            <h1 class="mt-2 text-lg/7 font-medium tracking-tight text-gray-950 max-lg:text-center">Session</h1>
        </div>
        <div class="px-8 sm:px-10 sm:pt-4">
            <div class="mb-4">
                <h2 class="font-bold mb-2 text-sm">Current ticket:</h2>
                <p class="text-sm">RE-1345: Menu text misaligned...</p>
            </div>
            <Participants />
           <div class="relative flex justify-around mb-4">
                <Timer />
                <TotalEstimate />
            </div>
            <div class="flex justify-between">
                <button onclick={revealCards} class={`btn btn-sm`}>Reveal</button>
                <button onclick={reEstimateHandler} class="btn btn-sm">Re-estimate</button>
                <button class="btn btn-accent btn-sm">Save</button>
            </div>
        </div>
    </div>
</section>