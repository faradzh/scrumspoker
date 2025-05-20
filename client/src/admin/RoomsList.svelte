<script lang="ts">
    import { useIsFetching } from "@tanstack/svelte-query";
    import {rooms} from "../store";
    import RoomCard from "./RoomCard.svelte";
    import RoomCardSkeleton from "./RoomCardSkeleton.svelte";

    const isCreatingNewRoom = useIsFetching({queryKey: ['createRoom']});
</script>

{#if $rooms.length === 0}
  <div class="text-center">
    <img class="max-w-80 m-auto mb-2" src="/no-rooms-data.png" alt="">
    <h3 class="text-[var(--color-text)] text-lg font-bold">No rooms created yet.</h3>
  </div>
{/if}

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {#each $rooms as room}
    <RoomCard room={room} />
  {/each}
  {#if $isCreatingNewRoom > 0}
    <RoomCardSkeleton />
  {/if}
</div>