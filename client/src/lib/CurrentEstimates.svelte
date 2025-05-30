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

    let scrollContainer: HTMLDivElement | null = null;

    function checkScrollbar() {
        const isScrollable = scrollContainer?.scrollWidth! > scrollContainer?.clientWidth!;
        if (isScrollable) {
            scrollContainer?.classList.remove('justify-center');
        } else {
            scrollContainer?.classList.add('justify-center');
        }
    }

  onMount(() => {
    checkScrollbar();

    const mutationObserver = new MutationObserver(checkScrollbar);
    mutationObserver.observe(scrollContainer!, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
    };
  });
</script>

<div class="mb-4">
    <div bind:this={scrollContainer} class="flex justify-center gap-4 whitespace-nowrap overflow-x-auto pb-8">
        {#each $participants as participant, index}
            <div class="text-center min-w-[92px] flex-none">
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