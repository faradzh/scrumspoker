<script lang="ts">
  import { useIsFetching } from "@tanstack/svelte-query";
  import { currentIssueId, issuesStore, selectedCards, sessionInfo } from "../store";
  import ActionButtons from "./ActionButtons.svelte";
  import CurrentEstimates from "./CurrentEstimates.svelte";
  import TotalEstimate from "./TotalEstimate.svelte";
  import { calculateAverage } from "./utils";
  import ParticipantsSkeleton from "./ParticipantsSkeleton.svelte";
  
  const isEnabled = $derived.by(() => {
    if (!$currentIssueId) {
      return false;
    }
    const total = calculateAverage($selectedCards[$currentIssueId]) || 0;
    return total > 0 && $sessionInfo[$currentIssueId]?.cardsAreFlipped;
  });

  // const currentStoryText = $derived($issuesStore.current ? ( $issuesStore.current?.key + ": " + $issuesStore.current?.summary) : '');

  const isUserFetching = useIsFetching({
    queryKey: ['currentUser'],
  });
  const isRoomDataFetching = useIsFetching({
    queryKey: ['roomData'],
  });
</script>

<section class="relative text-black overflow-hidden row-span-1">
    <div class="absolute inset-px rounded-lg bg-white"></div>
    <div class="relative flex h-full flex-col rounded-[calc(theme(borderRadius.lg)+1px)]">
        <div class="p-4 h-full flex flex-col">
          <div class="overflow-y-auto scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <div class="mb-14">
              <div class="flex justify-center gap-x-4 min-h-[104px]">
                <!-- <div>
                    <h2 class="text-xl font-semibold text-gray-950">Current Estimation</h2>
                    <p class="text-gray-600">{currentStoryText}</p>
                </div> -->
                <ActionButtons />
                {#if isEnabled}
                  <TotalEstimate />
                {/if}
              </div>
            </div>
            {#if $isUserFetching || $isRoomDataFetching}
                <ParticipantsSkeleton />
            {:else}
              <CurrentEstimates />
            {/if}
          </div>
        </div>
    </div>
    <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
</section>