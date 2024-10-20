<script lang="ts">
  import { selectedCards } from "../store";

  const svgModules = import.meta.glob("../assets/*.svg");

  let pokerCards: string[];
  $: pokerCards = [];

  for (const key in svgModules) {
    svgModules[key]().then(({ default: cardUrl }) => {
      pokerCards = [...pokerCards, cardUrl].sort();
    });
  }

  function clickHandler(e: MouseEvent) {
    const target = e.target as HTMLImageElement;
    selectedCards.update((prevCards) => [...prevCards, {id: crypto.randomUUID(), link: target?.src}]);
  }
</script>

<div class="p-[16px] grid grid-cols-3 gap-4 overflow-y-auto overflow-x-hidden">
  {#each pokerCards as pokerCard}
    <div class="poker-card cursor-pointer w-full">
      <img src="{pokerCard}" alt="" on:click={clickHandler}>
    </div>
  {/each}
</div>
