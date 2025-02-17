<script lang="ts">
  import { onMount } from "svelte";
  import { socket } from "../sockets";
  import { selectedCards } from "../store";
  import Card from "./Card.svelte";
  import { revealHandler } from "./utils";

  onMount(() => {
    socket.on('reveal', revealHandler);

    return () => {
      socket.off('reveal', revealHandler);
    }
  })

</script>

<div class="flex p-6 overflow-x-auto">
  {#each $selectedCards as selectedCard}
    <Card card={selectedCard} />
  {/each}
</div>
