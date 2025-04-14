<script lang="ts">
  import { onMount } from "svelte";

  import { currentIssueId, currentUser, participants, selectedCards } from "../store";
  import Card from "./Card.svelte";
  import { socket } from "../sockets";
  import { revealHandler } from "./utils";

    onMount(() => {
        socket.on('reveal', revealHandler);

        return () => {
            socket.off('reveal', revealHandler);
        }
    });

    function getFirstName(participant: any) {
        if ($currentUser.id === participant.id) {
            return 'You';
        }
        return participant.name?.trim()?.split(' ')?.[0] ?? '';
    }
</script>

<div class="mb-4">
    <div class="flex">
        {#each $participants as participant, index}
            <div class="mr-6 text-center min-w-[80px]">
                <div class={`avatar online mb-2 ${!participant.picture ? 'placeholder' : ''}`}>
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
                <span class="block mb-2 font-semibold min-h-6 w-20 overflow-hidden whitespace-nowrap text-ellipsis text-center">
                    {getFirstName(participant)}
                </span>
                {#if $currentIssueId && $selectedCards[$currentIssueId]?.[participant.id]}
                    <Card card={$selectedCards[$currentIssueId][participant.id]} />
                {/if}
            </div>
        {/each}
    </div>
</div>