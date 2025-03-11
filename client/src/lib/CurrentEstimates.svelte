<script lang="ts">
  import { onMount } from "svelte";

  import { participants, selectedCards } from "../store";
  import Card from "./Card.svelte";
  import { socket } from "../sockets";
  import { revealHandler } from "./utils";

    onMount(() => {
        socket.on('reveal', revealHandler);

        return () => {
            socket.off('reveal', revealHandler);
        }
    });
</script>

<div class="mb-12 min-h-[199.3px]">
    <div class="flex">
        {#each $participants as participant, index}
            <div class="mr-6 text-center min-w-[80px]">
                <div class={`avatar online mb-4 ${!participant.picture ? 'placeholder' : ''}`}>
                    {#if participant.picture}
                        <div class="w-16 rounded-full">
                            <img src={participant.picture} alt={`Participant #${index}`} />
                        </div>
                    {:else}
                        <div class="bg-gray-800 text-neutral-content w-16 rounded-full">
                            <span class="text-xl">AI</span>
                        </div>
                    {/if}
                </div>
                {#if $selectedCards[participant.id]}
                    <Card card={$selectedCards[participant.id]} />
                {/if}
            </div>
        {/each}
    </div>
</div>