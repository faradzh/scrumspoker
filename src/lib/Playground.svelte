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

<section class="playground">
  <div class="table-of-cards">
    {#each pokerCards as pokerCard}
      <div class="poker-card--selected">
        <img src="{pokerCard}" alt="">
      </div>
    {/each}
  </div>
  <div class="action-buttons"></div>
</section>

<style>
  .playground {
    grid-area: playground;
    background-color: rgb(52, 36, 117);
  }

  .table-of-cards {
    display: flex;
    padding: 24px;
    overflow-x: auto;
  }

  .poker-card--selected {
    margin-right: 24px;
    flex-basis: 100px;
    flex-shrink: 0;
    cursor: pointer;
  }
</style>
