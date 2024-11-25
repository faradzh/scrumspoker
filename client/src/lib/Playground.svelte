<script lang="ts">
  import { selectedCards } from "../store";
  import Card from "./Card.svelte";
  import type { SelectedCard } from "./types";

  let pokerCards: SelectedCard[] = $state();

  selectedCards.subscribe((value) => pokerCards = value);
</script>

<div class="flex p-6 overflow-x-auto">
  {#each pokerCards as pokerCard}
    <Card {pokerCard} />
  {/each}
</div>
