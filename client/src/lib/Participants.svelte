<script lang="ts">
  import { participants, selectedCards } from "../store";
  import Card from "./Card.svelte";
</script>

<div class="mb-12">
    <div class="flex">
        {#each $participants as participant, index}
            <div class="mr-6 text-center min-w-[80px]">
                <div class={`avatar online mb-4 ${!participant.picture ? 'placeholder' : ''}`}>
                    {#if participant.picture}
                        <div class="w-16 rounded-full">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt={`Participant #${index}`} />
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
            <div class="mr-16 text-center min-w-[80px]">
                <div class={`avatar online  mb-4 ${!participant.picture ? 'placeholder' : ''}`}>
                    {#if participant.picture}
                        <div class="w-16 rounded-full">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt={`Participant #${index}`} />
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