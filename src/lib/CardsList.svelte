<script lang="ts">
  const svgModules = import.meta.glob("../assets/*.svg");

  let pokerCards: string[];
  $: pokerCards = [];

  for (const key in svgModules) {
    svgModules[key]().then(({ default: cardUrl }) => {
      pokerCards = [...pokerCards, cardUrl].sort();
    });
  }
</script>

<section class="list-of-cards">
  {#each pokerCards as pokerCard}
    <div class="poker-card">
      <img src="{pokerCard}" alt="">
    </div>
  {/each}
</section>

<style>
  .list-of-cards {
    grid-area: list-of-cards;
    display: grid;
    grid-template-columns: auto auto auto;
    background-color: rgb(46, 137, 98);
    padding: 16px;
    overflow-y: auto;
    overflow-x: hidden;
    column-gap: 16px;
  }

  .poker-card {
    cursor: pointer;
    width: 100px;
    margin-bottom: 8px;
  }
</style>
