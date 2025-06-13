<script lang="ts">
  import { onMount } from "svelte";
  import Story from "./Story.svelte";
  import { fetchIssues } from "../services/roomService";
  import { currentIssueId, isModerator, issuesStore, setCurrentIssue } from "../store";
  import { socket } from "../sockets";

  import type { Issue } from "./types";
  import StoryDetails from "./StoryDetails.svelte";
  import { createQuery } from "@tanstack/svelte-query";
  import StorySkeleton from "./StorySkeleton.svelte";

  let storiesList: HTMLDivElement;

  const query = createQuery({
    queryKey: ["issues"],
    queryFn: fetchIssues,
    refetchOnWindowFocus: false,
  });

  const issues: Issue[] = $derived($query.data?.data ?? []);

  $effect(() => {
    if (issues) {
      if ($query.data?.currentIssue) {
        const currentIssue = issues.find((issue: any) => issue.id === $query.data?.currentIssue);
        currentIssue && setCurrentIssue(currentIssue);
      } else {
        setCurrentIssue(issues[0]);
      }
      $issuesStore.domainUrl = $query.data?.domainUrl || "";
    }
  })

  function selectIssueHandler(issue: Issue) {
    if (!$isModerator || issue.id === $currentIssueId) {
      return;
    }
    setCurrentIssue(issue);
    emitIssueSelect(issue);
  }

  function emitIssueSelect(issue: Issue) {
    socket.emit('issueSelect', ({id: issue.id}))
  }

  onMount(() => {
    socket.on('issueSelect', ({id}) => {
      const issue = issues.find((issue) => issue.id === id);
      if (issue) {
        setCurrentIssue(issue);
      }
    });
  });

  onMount(() => {
    // Wait for expansion animation
    new Promise(resolve => setTimeout(resolve, 100)).then(() => {
       // Lock width
      const rect = storiesList.getBoundingClientRect();
      storiesList.style.width = rect.width + "px";
      $issuesStore.initialColumnWidth = rect.width;
    });
  });

</script>

<section class="relative row-span-2">
    <div class="absolute inset-px rounded-lg bg-white"></div>
    <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
        <div class="p-4 h-full">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-950">User Stories</h2>
                <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-sm">{issues.length} stories</span>
            </div>
              <div bind:this={storiesList} id="stories-list" class="transition-name space-y-2 pb-8 h-full overflow-y-auto scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {#if $query.isLoading}
                  <StorySkeleton />
                  <StorySkeleton />
                  <StorySkeleton />
                {/if}
                {#if $issuesStore.expandedIssue}
                  <StoryDetails story={$issuesStore.expandedIssue}/>
                {:else if $query.isSuccess}  
                  {#each issues as issue}
                    <Story story={issue} onSelect={() => selectIssueHandler(issue)} isSelected={issue.id === $currentIssueId} />
                  {/each}
                {/if}
              </div>
        </div>
    </div>
    <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
</section>