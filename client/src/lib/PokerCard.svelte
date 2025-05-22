<script lang="ts">
  import { socket } from "../sockets";
  import { selectCard } from "./utils";

  const {card} = $props();
</script>

<div class="relative cursor-pointer mr-4 h-32 transition-transform duration-200 ease-in-out hover:-translate-y-2 hover:scale-105 hover:shadow-lg will-change-transform backface-hidden">
    <span class="absolute text-white text-md top-2 left-3 font-bold">{card.value}</span>
    <span class="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold">{card.value}</span>
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
    <img src="{card.link}" alt="" onclick={() => selectCard(socket, card)} class="rounded-lg shadow-md h-full w-full origin-center"/>
    <span class="absolute text-white text-md bottom-2 right-3 font-bold">{card.value}</span>
</div>