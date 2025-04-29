<script lang="ts">
  import { issuesStore } from "../store";
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
            <p class="font-medium">Medium</p>
        </div>
        <div>
            <p class="text-xs text-gray-500">Assignee</p>
            <p class="font-medium">Jane Smith</p>
        </div>
        <div>
            <p class="text-xs text-gray-500">Reporter</p>
            <p class="font-medium">John Doe</p>
        </div>
        <div>
            <p class="text-xs text-gray-500">Sprint</p>
            <p class="font-medium">Sprint 24</p>
        </div>
        </div>
    </div>
    
    <div class="mb-6">
        <h4 class="font-medium mb-3">Comments</h4>
        <div class="bg-gray-50 p-3 rounded">
        <div class="flex justify-between text-sm mb-1">
            <span class="font-medium">Alex Chen</span>
            <span class="text-gray-500">Yesterday at 3:45 PM</span>
        </div>
        <p class="text-sm">I've started working on this. Will have a prototype ready by tomorrow.</p>
        </div>
    </div>
    
    <div>
        <h4 class="font-medium mb-3">Attachments</h4>
        <div class="flex gap-2 flex-wrap">
        <div class="bg-gray-100 px-3 py-2 rounded text-sm flex items-center">
            <span class="mr-2">📄</span>
            <span>design-mockup.png</span>
        </div>
        <div class="bg-gray-100 px-3 py-2 rounded text-sm flex items-center">
            <span class="mr-2">📄</span>
            <span>requirements.pdf</span>
        </div>
        </div>
    </div>
</div>