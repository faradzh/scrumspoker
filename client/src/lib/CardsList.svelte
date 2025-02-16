<script lang="ts">
  import { socket } from "../sockets";

  import type { Card } from "./types";
  import { POKER_CARDS } from "../constants";
  import { selectCard } from "./utils";

  function clickHandler(card: Card) {
    selectCard(socket, card);
  }
  
</script>

<div class="p-[16px] grid grid-cols-3 gap-4 overflow-y-auto overflow-x-hidden">
  {#each POKER_CARDS as pokerCard}
    <div class="poker-card cursor-pointer w-full">
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
      <img src="{pokerCard.link}" alt="" onclick={() => clickHandler(pokerCard)}>
    </div>
  {/each}
</div>
