<script lang="ts">
  import { POKER_CARDS } from "../constants";
  import { socket } from "../sockets";
  import { currentIssueId, currentUser, selectedCards, sessionInfo } from "../store";
  import BaseCard from "./BaseCard.svelte";
  import type { Card } from "./types";
  import { selectCard } from "./utils";
  
  function onSelect(pokerCard: Card) {
    if (votingIsDisabled || $currentIssueId && $selectedCards?.[$currentIssueId]?.[$currentUser.id]?.value === pokerCard.value) {
      console.log("Card already selected or voting is disabled", votingIsDisabled);
      return;
    }
    selectCard(socket, pokerCard);
  }

  const votingIsDisabled = $derived($currentIssueId && $sessionInfo[$currentIssueId]);

  const hoverClass = "transition-transform duration-200 ease-in-out hover:-translate-y-2 hover:scale-105 hover:shadow-lg will-change-transform backface-hidden";
</script>

<section class="relative">
  <div class="bg-white w-full h-full lg:rounded-t-[calc(theme(borderRadius.lg)+1px)]">
    <div class="p-4">
      <h2 class="text-xl font-semibold text-gray-950">Your Estimation</h2>
      <div class="flex overflow-x-auto pt-4 justify-center">
        {#each POKER_CARDS as pokerCard}
          <BaseCard card={pokerCard} onSelect={() => onSelect(pokerCard)} class={`relative cursor-pointer mr-4 h-32 ${!votingIsDisabled ? hoverClass : ''}`} />
        {/each}
      </div>
    </div>
  </div>
  <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
</section>
