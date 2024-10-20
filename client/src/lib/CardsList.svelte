<script lang="ts">
  import { socket } from "../sockets";

  import { selectedCards, type SelectedCard } from "../store";

  socket.on('estimation', (data) => {
    selectedCards.update((prevCards) => [...prevCards, data]);
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
    socket.emit('estimation', {userId: socket.id, selectedCard: pokerCard.link});
  }
</script>

<div class="p-[16px] grid grid-cols-3 gap-4 overflow-y-auto overflow-x-hidden">
  {#each pokerCards as pokerCard}
    <div class="poker-card cursor-pointer w-full">
      <img src="{pokerCard.link}" alt="" on:click={() => clickHandler(pokerCard)}>
    </div>
  {/each}
</div>
