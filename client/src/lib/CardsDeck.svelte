<script lang="ts">
  import { socket } from "../sockets";
  import Card from "./Card.svelte";
  import { selectCard } from "./utils";
  import { POKER_CARDS } from "../constants";

  // onMount(() => {
  //   socket.on('reveal', revealHandler);

  //   return () => {
  //     socket.off('reveal', revealHandler);
  //   }
  // })

  function clickHandler(card: Card) {
    console.log("Card", card);
    selectCard(socket, card);
  }

</script>

<section class="relative lg:col-span-1">
  <div class="bg-white w-full h-full lg:rounded-t-[calc(theme(borderRadius.lg)+1px)]">
    <div class="p-6">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-950">Your Estimation</h2>
      </div>
      <div class="flex overflow-x-auto">
        {#each POKER_CARDS as pokerCard}
          <div class="poker-card cursor-pointer w-full mr-6">
            <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
            <img class="rounded-lg" src="{pokerCard.link}" alt="" onclick={() => clickHandler(pokerCard)} />
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
</section>
