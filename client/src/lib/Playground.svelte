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

<section class="relative lg:col-span-2">
  <div class="bg-white w-full h-full lg:rounded-t-[calc(theme(borderRadius.lg)+1px)]"></div>
  <div class="flex p-6 overflow-x-auto">
    {#each $selectedCards as selectedCard}
    <Card card={selectedCard} />
    {/each}
  </div>
  <div class="absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
</section>
