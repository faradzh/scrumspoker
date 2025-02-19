<script lang="ts">
  import { participants } from "../store";
</script>

<div class="mb-12">
    <h2 class="font-bold mb-4 text-sm">Active participants:</h2>
    <div class="flex">
        {#each $participants as participant, index}
            <div class={`avatar online mr-2 ${!participant.picture ? 'placeholder' : ''}`}>
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
        {/each}
    </div>
</div>