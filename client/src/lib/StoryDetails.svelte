<script lang="ts">
  import { issuesStore } from "../store";
  import { renderContent } from "./adfRenderer";
  import { getDisplayName, getFormattedDate } from "./commentRenderer";
  import Story from "./Story.svelte";

  const {story} = $props();
</script>

<Story story={story} isSelected={$issuesStore.expandedIssue?.id === $issuesStore.current?.id} />
<div id="story-details" class="mt-6 pt-4 border-t border-gray-200 text-black transition-name">
    <div class="mb-6">
        <h4 class="font-medium mb-3">Details</h4>
        <div class="grid grid-cols-2 gap-4">
        <div>
            <p class="text-xs text-gray-500">Priority</p>
            <p class="font-medium">{story.priority}</p>
        </div>
        {#if story.assignee}
            <div>
                <p class="text-xs text-gray-500">Assignee</p>
                <p class="font-medium">{story.assignee}</p>
            </div>
        {/if}
        <div>
            <p class="text-xs text-gray-500">Reporter</p>
            <p class="font-medium">{story.reporter}</p>
        </div>
        <div>
            <p class="text-xs text-gray-500">Issue Type</p>
            <p class="font-medium">{story.issuetype}</p>
        </div>
        </div>
    </div>

    {#if story.comment.length > 0}
        <div class="mb-6">
            <h4 class="font-medium mb-3">Comments</h4>
            {#each story.comment as comment }
                <div class="bg-gray-50 p-3 rounded mb-2">
                    <div class="flex justify-between text-sm mb-1">
                        <span class="font-medium">{getDisplayName(comment)}</span>
                        <span class="text-gray-500">{getFormattedDate(comment.updated)}</span>
                    </div>
                    <p class="text-sm">
                        {@html renderContent(comment.body.content)}
                    </p>
                </div>
            {/each}
        </div>
    {/if}
</div>