<script lang="ts">
  import { selectedCards, type SelectedCard } from "../store";
  import Card from "./Card.svelte";

  let pokerCards: SelectedCard[];

  selectedCards.subscribe((value) => pokerCards = value);
</script>

<div class="flex p-6 overflow-x-auto">
  {#each pokerCards as pokerCard}
    <Card {pokerCard} />
  {/each}
</div>
