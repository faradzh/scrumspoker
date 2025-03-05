<script lang="ts">
  import { socket } from "../sockets";

  import type { Card } from "./types";
  import { POKER_CARDS } from "../constants";
  import { selectCard } from "./utils";

  function clickHandler(card: Card) {
    selectCard(socket, card);
  }
  
</script>

<section class="relative lg:row-span-2">
  <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
  <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
    <div class="p-[16px] grid grid-cols-3 gap-4 overflow-y-auto overflow-x-hidden">
      {#each POKER_CARDS as pokerCard}
        <div class="poker-card cursor-pointer w-full">
          <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
          <img src="{pokerCard.link}" alt="" onclick={() => clickHandler(pokerCard)}>
        </div>
      {/each}
    </div>
  </div>
  <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
</section>
