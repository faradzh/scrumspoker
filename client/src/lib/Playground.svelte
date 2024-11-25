<script lang="ts">
  import { selectedCards } from "../store";
  import Card from "./Card.svelte";
</script>

<div class="flex p-6 overflow-x-auto">
  {#each $selectedCards as selectedCard}
    <Card card={selectedCard} />
  {/each}
</div>
