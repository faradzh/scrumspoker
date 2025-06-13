<script lang="ts">
  import { X, PanelRightClose } from '@lucide/svelte';

  import { isModerator, issuesStore } from "../store";
  import type { Issue } from './types';
  import { renderContent } from './adfRenderer';

  let {story, onSelect, isSelected} = $props<{
    story: Issue;
    isSelected: boolean;
    onSelect?: () => void;
  }>();

  async function onExpand() {
    const container = document.getElementById('stories-list')!;

    // Expand
    container.style.width = '600px';

    // Wait for expansion animation
    await new Promise(resolve => setTimeout(resolve, 100));
  
    $issuesStore.expandedIssue = story;
  }

  function onClose() {
    const container = document.getElementById('stories-list')!;
    $issuesStore.expandedIssue = null;

    container.style.width = `${$issuesStore.initialColumnWidth}px`;
  }

  function getStoryLink() {
    const domainUrl = $issuesStore.domainUrl;
    return `${domainUrl}/browse/${story.key}`;
  }

  const totalEstimate = $derived.by(() => {
    if ($issuesStore.estimated.includes(story.id)) {
      return $issuesStore.totalEstimationPerIssue[story.id];
    }
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={`p-3 overflow-hidden rounded-md ${!$issuesStore.expandedIssue ? 'max-h-24' : ''} transition-colors ${isSelected ? 'bg-indigo-50 border-l-4 border-[var(--color-primary)]' : ''}`}>
    <div class="flex justify-between items-center">
        <a target="_blank" href={getStoryLink()} class="text-xs font-medium text-gray-500 underline">{story.key}</a>
        <span class={`text-xs px-2 py-0.5 ml-auto mr-2 rounded-full ${totalEstimate ? 'bg-[var(--color-success)] text-white' : 'bg-yellow-100 text-yellow-800'}`}>{totalEstimate ? totalEstimate : 'To Do'}</span>
        {#if $issuesStore.expandedIssue}
          <span class="cursor-pointer">
            <X size="20" color="black" onclick={onClose} />
          </span>
        {:else}
          <span class="cursor-pointer">
            <PanelRightClose size="16" color="black" onclick={onExpand} class="cursor-pointer"/>
          </span>
        {/if}
    </div>
    <div onclick={onSelect} class={`${$isModerator ? 'cursor-pointer': ''}`}>
      <h3 class="font-medium text-gray-950 mt-1 mb-1 line-clamp-2">{story.summary}</h3>
      {#if $issuesStore.expandedIssue}
        <p class={`text-md text-gray-600 ${!$issuesStore.expandedIssue ? 'line-clamp-2' : ''}`}>
          {#if story.description}
            {@html renderContent(story.description.content)}
          {/if}
        </p>
      {/if}
    </div>
</div>