<script lang="ts">
  import { onMount } from "svelte";

  import { currentIssueId, currentUser, participants, selectedCards } from "../store";
  import Card from "./EstimationCard.svelte";
  import { socket } from "../sockets";
  import { revealHandler } from "./utils";
  import Avatar from "./Avatar.svelte";

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
    <div class="flex justify-center space-x-4">
        {#each $participants as participant, index}
            <div class="text-center min-w-[80px]">
                <Avatar participant={participant} index={index} />
                <h2 class="block mx-auto mb-2 font-semibold min-h-6 w-20 overflow-hidden whitespace-nowrap text-ellipsis">
                    {getFirstName(participant)}
                </h2>
                {#if $currentIssueId && $selectedCards[$currentIssueId]?.[participant.id]}
                    <Card card={$selectedCards[$currentIssueId][participant.id]} />
                {/if}
            </div>
        {/each}
    </div>
</div>