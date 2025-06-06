<script lang="ts">
  import { getAbbreviation } from "./utils";

  const {participant, index} = $props();
</script>
<div class={`avatar mb-2 ${participant.online ? 'online' : 'offline'} ${!participant.picture ? 'placeholder' : ''}`}>
    {#if participant.picture}
        <div class="w-12 rounded-full">
            <img src={participant.picture} alt={`Participant #${index}`} />
        </div>
    {:else}
        <div class="bg-gray-800 text-neutral-content w-12 rounded-full">
            <span class="text-l">{getAbbreviation(participant.name)}</span>
        </div>
    {/if}
</div>