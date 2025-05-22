<script lang="ts">
  import { POKER_CARDS } from "../constants";
  import PokerCard from "./PokerCard.svelte";
</script>

<section class="relative">
  <div class="bg-white w-full h-full lg:rounded-t-[calc(theme(borderRadius.lg)+1px)]">
    <div class="p-4">
      <h2 class="text-xl font-semibold text-gray-950">Your Estimation</h2>
      <div class="flex overflow-x-auto pt-4 justify-center">
        {#each POKER_CARDS as pokerCard}
          <PokerCard card={pokerCard} />
        {/each}
      </div>
    </div>
  </div>
  <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
</section>
