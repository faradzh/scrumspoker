<script lang="ts">
  import { createMutation } from "@tanstack/svelte-query";
  import { updateIssue } from "../services/roomService";
  import { currentIssueId, isModerator, issuesStore, totalEstimate } from "../store";
  import ToastService from "../services/toastService";
  import { Check } from "@lucide/svelte";

  function saveHandler() {
    $query.mutate();
  }

  const query = createMutation({
    mutationKey: ["saveEstimate", $currentIssueId],
    mutationFn: async () => {
      if (!$currentIssueId) return;
      await updateIssue($currentIssueId, $totalEstimate);
    },
    onSuccess: () => {
      if ($currentIssueId) {
        issuesStore.update((state) => {
          return {
            ...state,
            estimated: [...state.estimated, $currentIssueId],
          };
        });
      };
      ToastService.showToast("Estimation saved!");
    },
    onError: () => {
      ToastService.showToast(`Error saving estimation!`, {type: "error"});
    }
  });

  const issuesIsEstimated = $derived(!!($currentIssueId && $issuesStore.estimated.includes($currentIssueId)));
  const saveIsDisabled = $derived($query.isPending || issuesIsEstimated);
</script>

<div class="flex justify-center items-center space-x-2 mt-auto">
    <div class="flex flex-row items-center space-x-2">   
        <div class="stats shadow rounded-lg mb-2">
            <div class="stat">
                <div class="stat-title">Total Estimate</div>
                <div class="stat-value text-center">{$totalEstimate}</div>
            </div>
        </div>
        {#if $isModerator}
        <div class="flex flex-col space-y-2 items-center">
          <button disabled={saveIsDisabled} onclick={saveHandler} class="flex items-center justify-center gap-x-2 px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition w-full">
            {#if $query.isPending}
              <span class="loading loading-spinner h-4 w-4"></span>
            {:else if $query.isSuccess || issuesIsEstimated}
              <Check class="h-4 w-4" />
            {/if}
            {issuesIsEstimated ? "Saved" : "Save"}
          </button>
          <button class="px-4 py-1 bg-[var(--color-bg)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text)] rounded-md transition w-full">Reestimate</button>
        </div>
        {/if}
    </div> 
   
</div>