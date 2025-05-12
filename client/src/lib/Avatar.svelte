<script lang="ts">
    const {participant, index} = $props();

    function getAbbreviation(name: string) {
        const parts = name.trim().split(' ');
        if (parts.length > 1) {
            return parts[0][0] + parts[1][0];
        }
        return parts[0][0];
    }
</script>
<div class={`avatar mb-2 ${participant.online ? 'online' : 'offline'} ${!participant.picture ? 'placeholder' : ''}`}>
    {#if participant.picture}
        <div class="w-16 rounded-full">
            <img src={participant.picture} alt={`Participant #${index}`} />
        </div>
    {:else}
        <div class="bg-gray-800 text-neutral-content w-16 rounded-full">
            <span class="text-xl">{getAbbreviation(participant.name)}</span>
        </div>
    {/if}
</div>