<script lang="ts">
  import { useIsFetching } from "@tanstack/svelte-query";
  import { currentIssueId, isModerator, issuesStore, selectedCards, sessionInfo } from "../store";
  import ActionButtons from "./ActionButtons.svelte";
  import CurrentEstimates from "./CurrentEstimates.svelte";
  import Timer from "./Timer.svelte";
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

  const currentStoryText = $derived($issuesStore.current ? ( $issuesStore.current?.key + ": " + $issuesStore.current?.summary) : '');

  const isUserFetching = useIsFetching({
    queryKey: ['currentUser'],
  });
  const isRoomDataFetching = useIsFetching({
    queryKey: ['roomData'],
  });
</script>

<section class="relative text-black overflow-x-hidden">
    <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
    <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
        <div class="p-4 h-full flex flex-col">
            <div class="mb-6">
                <div class="flex justify-between">
                    <div>
                        <h2 class="text-xl font-semibold text-gray-950">Current Estimation</h2>
                        <p class="text-gray-600">{currentStoryText}</p>
                    </div>
                    <div class="flex items-center space-x-4 mt-4 md:mt-0">
                        <Timer />
                        {#if $isModerator}
                          <ActionButtons />
                        {/if}
                    </div>
                </div>
            </div>
            {#if $isUserFetching || $isRoomDataFetching}
                <ParticipantsSkeleton />
            {:else}
              <CurrentEstimates />
              {#if isEnabled}
                  <TotalEstimate />
              {/if}
            {/if}
        </div>
    </div>
    <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
</section>