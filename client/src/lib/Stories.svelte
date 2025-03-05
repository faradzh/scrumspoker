<script lang="ts">
  import { onMount } from "svelte";
  import Story from "./Story.svelte";

  let stories: Array<{id: string}> = $state([]);
  let selectedStory: {id: string} | undefined = $state();

  function fetchStories() {
    const roomId = location.pathname.split("/").pop();

    fetch(`/issues?roomId=${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Data", data);
        if (data.error) {
          console.error(data.error);
          return;
        }
        stories = data;
        selectedStory = data?.[0];
      });
  }

  function selectStory(story: {id: string}) {
    if (story.id === selectedStory?.id) {
        return;
    }
    selectedStory = story;
  }

  onMount(() => {
    fetchStories();
  });

</script>

<section class="relative lg:row-span-3">
    <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
    <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
        <div class="p-4 h-full">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-950">User Stories</h2>
                <span class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md text-sm">8 stories</span>
            </div>
            <div class="space-y-2 max-h-[655px] pr-2 scrollbar-visible overflow-y-scroll scrollbar scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                {#each stories as story}
                    <Story {story} onSelect={selectStory} isSelected={story.id === selectedStory?.id} />
                {/each}
            </div>
        </div>
    </div>
    <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
</section>