<script lang="ts">
  import { onMount } from "svelte";
  import Story from "./Story.svelte";
  import { fetchIssues } from "../services/roomService";
  import { currentIssueId, isModerator, issuesStore, setCurrentIssue, setIssuesList } from "../store";
  import { socket } from "../sockets";

  import type { Issue } from "./types";

  async function fetchStories() {
    const data = await fetchIssues();
    setIssuesList(data);
    if (!$issuesStore.current) {
      setCurrentIssue(data[0]);
    }
  }

  function selectIssueHandler(issue: Issue) {
    if (!$isModerator) {
      return;
    }
    setCurrentIssue(issue);
    emitIssueSelect(issue);
  }

  function emitIssueSelect(issue: Issue) {
    socket.emit('issueSelect', ({id: issue.id}))
  }

  onMount(() => {
    fetchStories();

    socket.on('issueSelect', ({id}) => {
      const issue = $issuesStore.list.find((issue) => issue.id === id);
      if (issue) {
        setCurrentIssue(issue);
      }
    });
  });

</script>

<section class="relative row-span-2">
    <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
    <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
        <div class="p-4 h-full">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-950">User Stories</h2>
                <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-sm">{$issuesStore.list.length} stories</span>
            </div>
            <div class="space-y-2 max-h-[655px] scrollbar-visible overflow-y-scroll scrollbar scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                {#each $issuesStore.list as issue}
                    <Story story={issue} onSelect={() => selectIssueHandler(issue)} isSelected={issue.id === $currentIssueId} />
                {/each}
            </div>
        </div>
    </div>
    <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
</section>