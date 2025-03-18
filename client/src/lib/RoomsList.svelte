<script lang="ts">
    import { onMount } from "svelte";
    import {rooms} from "../store";
    import RoomCard from "../admin/RoomCard.svelte";

    async function fetchRooms() {
        const response =  await fetch('/rooms');
        const data = await response.json();
        rooms.set(data);
    }
    onMount(() => {
        fetchRooms();
    });
</script>

{#if $rooms.length === 0}
  <div class="text-center">
    <img class="max-w-80 m-auto mb-6" src="/no-data-panda.svg" alt="">
    <h3 class="text-black text-lg font-bold">No rooms available yet.</h3>
  </div>
{/if}

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {#each $rooms as room}
    <RoomCard room={room} />
  {/each}
</div>