<script lang="ts">
  import { socket } from "../sockets";
  import Card from "./Card.svelte";
  import { selectCard } from "./utils";
  import { POKER_CARDS } from "../constants";

  function clickHandler(card: Card) {
    selectCard(socket, card);
  }

</script>

<section class="relative">
  <div class="bg-white w-full h-full lg:rounded-t-[calc(theme(borderRadius.lg)+1px)]">
    <div class="p-4">
      <h2 class="text-xl font-semibold text-gray-950">Your Estimation</h2>
      <div class="flex overflow-x-auto pt-4 justify-center">
        {#each POKER_CARDS as pokerCard}
          <div class="poker-card cursor-pointer mr-4 h-32">
            <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
            <img class="rounded-lg shadow-md h-full w-full transition-transform duration-200 ease-in-out hover:-translate-y-2 hover:scale-105 hover:shadow-lg origin-center will-change-transform backface-hidden" src="{pokerCard.link}" alt="" onclick={() => clickHandler(pokerCard)} />
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
</section>
