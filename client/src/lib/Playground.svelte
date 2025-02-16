<script lang="ts">
  import { socket } from "../sockets";
  import { selectedCards } from "../store";
  import Card from "./Card.svelte";
  import { flipHandler } from "./utils";

  socket.on('reveal', () => {
    const refList = $selectedCards.map((pokerCard) => pokerCard.ref!);
    flipHandler(refList, () => {});
  });
</script>

<div class="flex p-6 overflow-x-auto">
  {#each $selectedCards as selectedCard}
    <Card card={selectedCard} />
  {/each}
</div>
