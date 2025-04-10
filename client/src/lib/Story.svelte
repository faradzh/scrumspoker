<script lang="ts">
    let {story, onSelect, isSelected} = $props();
</script>

<div onclick={onSelect} class={`p-3 rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500' : ''}`}>
    <div class="flex justify-between items-start">
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{story.key}</span>
        <span class="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">{story.status}</span>
    </div>
    <h3 class="font-medium text-gray-950 mt-1 mb-1">{story.summary}</h3>
    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {story.description}
</div>