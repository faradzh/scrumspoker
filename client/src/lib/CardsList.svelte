<script lang="ts">
  import { onMount } from "svelte";
  import { socket } from "../sockets";

  import { selectedCards, userStore } from "../store";
  import { compareLinks } from "./utils";
  import type { Card } from "./types";
  import { get } from "svelte/store";

  socket.on('estimation', (data) => {
    selectedCards.update((prevCards) => [...prevCards, data.selectedCard]);
  });

  onMount(() => {
    socket.emit('ready');

    socket.on("ready", (data) => {
      const isModerator = data.moderatorId === socket.id;
      userStore.update(() => ({id: socket.id!, isModerator}))
    })
  });

  const svgModules = import.meta.glob("../assets/cards/*.svg");

  let pokerCards: Card[];
  $: pokerCards = [];

  for (const key in svgModules) {
    // @ts-ignore
    svgModules[key]().then(({ default: cardUrl }) => {
      pokerCards = [...pokerCards, {id: crypto.randomUUID(), link: cardUrl}].sort(compareLinks);
    });
  }

  function clickHandler(card: Card) {
    const isAlreadySelected = Array.from(get(selectedCards)).find((selectedCard) => selectedCard.userId === socket.id);
    if (!isAlreadySelected) {
      selectedCards.update((prevCards) => [...prevCards, {...card, userId: socket.id!}]);
      socket.emit('estimation', {userId: socket.id, selectedCard: card});
    }
  }
</script>

<div class="p-[16px] grid grid-cols-3 gap-4 overflow-y-auto overflow-x-hidden">
  {#each pokerCards as pokerCard}
    <div class="poker-card cursor-pointer w-full">
      <img src="{pokerCard.link}" alt="" on:click={() => clickHandler(pokerCard)}>
    </div>
  {/each}
</div>
