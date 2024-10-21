<script lang="ts">
  import { onMount } from "svelte";
  import { socket } from "../sockets";

  import { selectedCards, type SelectedCard, userStore } from "../store";

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

  const svgModules = import.meta.glob("../assets/*.svg");

  let pokerCards: SelectedCard[];
  $: pokerCards = [];

  for (const key in svgModules) {
    svgModules[key]().then(({ default: cardUrl }) => {
      pokerCards = [...pokerCards, {id: crypto.randomUUID(), link: cardUrl}].sort();
    });
  }

  function clickHandler(pokerCard: SelectedCard) {
    selectedCards.update((prevCards) => [...prevCards, pokerCard]);
    socket.emit('estimation', {userId: socket.id, selectedCard: pokerCard});
  }
</script>

<div class="p-[16px] grid grid-cols-3 gap-4 overflow-y-auto overflow-x-hidden">
  {#each pokerCards as pokerCard}
    <div class="poker-card cursor-pointer w-full">
      <img src="{pokerCard.link}" alt="" on:click={() => clickHandler(pokerCard)}>
    </div>
  {/each}
</div>
