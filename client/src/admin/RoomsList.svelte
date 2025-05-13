<script lang="ts">
    import { onMount } from "svelte";
    import {rooms} from "../store";
    import RoomCard from "./RoomCard.svelte";
    import { fetchRooms } from "../services/roomService";

    async function getData() {
      const data = await fetchRooms();
      rooms.set(data);
    }
    
    onMount(() => {
      getData();
    });
</script>

{#if $rooms.length === 0}
  <div class="text-center">
    <img class="max-w-80 m-auto mb-6" src="/no-data-panda.svg" alt="">
    <h3 class="text-[var(--color-text)] text-lg font-bold">No rooms available yet.</h3>
  </div>
{/if}

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {#each $rooms as room}
    <RoomCard room={room} />
  {/each}
</div>