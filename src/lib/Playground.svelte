<script lang="ts">
  import { selectedCards } from "../store";
  import Card from "./Card.svelte";

  let pokerCards: string[];

  selectedCards.subscribe((value) => pokerCards = value);
</script>

<section class="playground">
  <div class="table-of-cards">
    {#each pokerCards as pokerCard}
      <Card {pokerCard} />
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
</style>
