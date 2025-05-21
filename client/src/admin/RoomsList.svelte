<script lang="ts">
    import { createQuery, useIsMutating } from "@tanstack/svelte-query";
    import RoomCard from "./RoomCard.svelte";
    import RoomCardSkeleton from "./RoomCardSkeleton.svelte";
    import { fetchRooms } from "../services/roomService";

    const isCreatingNewRoom = useIsMutating({mutationKey: ['createRoom']});

    const query = createQuery({
        queryKey: ['rooms'],
        queryFn: () => fetchRooms(),
        staleTime: Infinity,
    });
</script>

{#if $query.isLoading}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <RoomCardSkeleton />
    <RoomCardSkeleton />
    <RoomCardSkeleton />
  </div>
{/if}

{#if $query.isError}
  <div class="text-center">
    <img class="max-w-80 m-auto mb-2" src="/error.png" alt="">
    <h3 class="text-[var(--color-text)] text-lg font-bold">Error loading rooms.</h3>
  </div>
{/if}

{#if $query.isSuccess}
  {#if $query.data.length === 0 && $isCreatingNewRoom === 0}
    <div class="text-center">
      <img class="max-w-80 m-auto mb-2" src="/no-rooms-data.png" alt="">
      <h3 class="text-[var(--color-text)] text-lg font-bold">No rooms created yet.</h3>
    </div>
  {/if}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each $query.data as room}
      <RoomCard room={room} />
    {/each}
    {#if $isCreatingNewRoom > 0}
      <RoomCardSkeleton />
    {/if}
  </div>
{/if}




