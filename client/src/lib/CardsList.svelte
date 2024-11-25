<script lang="ts">
  import { socket } from "../sockets";

  import { selectCard } from "../store";
  import { compareLinks } from "./utils";
  import type { Card } from "./types";
  import { onMount } from "svelte";

  const svgModules = import.meta.glob("../assets/cards/*.svg");

  let pokerCards: Card[] = $state([]);

  onMount(() => {
    for (const key in svgModules) {
      // @ts-ignore
      svgModules[key]().then(({ default: cardUrl }) => {
        pokerCards = [...pokerCards, {id: crypto.randomUUID(), link: cardUrl}].sort(compareLinks);
      });
    }
  });

  function clickHandler(card: Card) {
    selectCard(socket, card);
  }
</script>

<div class="p-[16px] grid grid-cols-3 gap-4 overflow-y-auto overflow-x-hidden">
  {#each pokerCards as pokerCard}
    <div class="poker-card cursor-pointer w-full">
      <img src="{pokerCard.link}" alt="" onclick={() => clickHandler(pokerCard)}>
    </div>
  {/each}
</div>
