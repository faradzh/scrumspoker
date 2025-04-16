<script lang="ts">
  import { isModerator } from "../store";

  let {story, onSelect, isSelected} = $props();
</script>

<div onclick={onSelect} class={`p-3 rounded-md ${$isModerator ? 'cursor-pointer': ''} transition-colors ${isSelected ? 'bg-indigo-50 border-l-4 border-[var(--color-primary)]' : ''}`}>
    <div class="flex justify-between items-start">
        <span class="text-xs font-medium text-gray-500">{story.key}</span>
        <span class="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">{story.status}</span>
    </div>
    <h3 class="font-medium text-gray-950 mt-1 mb-1">{story.summary}</h3>
    <p class="text-sm text-gray-600 line-clamp-2">
        {story.description}
    </p>
</div>