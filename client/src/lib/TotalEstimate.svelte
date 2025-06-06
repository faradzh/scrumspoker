<script lang="ts">
  import { createMutation } from "@tanstack/svelte-query";
  import { updateIssue } from "../services/roomService";
  import { currentIssueId, isModerator, issuesStore, totalEstimation } from "../store";
  import ToastService from "../services/toastService";
  import { Check, Pencil } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { socket } from "../sockets";
  import { resetEstimation, resetEstimationHandler } from "./utils";

  function saveHandler() {
    $query.mutate();
  }

  const query = createMutation({
    mutationKey: ["saveEstimate", $currentIssueId],
    mutationFn: async () => {
      if (!$currentIssueId) return;
      await updateIssue($currentIssueId, $totalEstimation);
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
      socket.emit('estimationSaved', {
        issueId: $currentIssueId,
        value: $totalEstimation
      });
      ToastService.showToast("Estimation saved!");
    },
    onError: () => {
      ToastService.showToast(`Error saving estimation!`, {type: "error"});
    }
  });

  onMount(() => {
    socket.on('resetEstimation', ({issueId}) => resetEstimationHandler(issueId));
    socket.on("estimationSaved", ({issueId, value}) => {
      if (issueId === $currentIssueId) {
        issuesStore.update((state) => {
          return {
            ...state,
            estimated: [...state.estimated, issueId],
            totalEstimationPerIssue: {
              ...state.totalEstimationPerIssue,
              [issueId]: value
            }
          };
        });
      }
    });
  });

  const issuesIsEstimated = $derived(!!($currentIssueId && $issuesStore.estimated.includes($currentIssueId)));
  const saveIsDisabled = $derived($query.isPending || issuesIsEstimated);

  function onTotalEdit(e: any) {
    const target = e.target as HTMLDivElement;

    try {
      const newValue = parseFloat(target.textContent || "0");
      if (isNaN(newValue)) {
        target.textContent = $totalEstimation.toString();
        return;
      }
      issuesStore.update((s) => {
        if (!$currentIssueId) return s;
        s.totalEstimationPerIssue[$currentIssueId] = newValue;
        return s;
      });
      placeCaretAtEnd(target);
    } catch (error) {
      console.error("Error parsing total estimate:", error);
      target.textContent = $totalEstimation.toString();
    }
  }

  let editableEstimation: HTMLDivElement | null = null;

  function placeCaretAtEnd(el: HTMLDivElement) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false); // Move to end
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  function focusEditableEstimation() {
    if (editableEstimation) {
      editableEstimation.focus();
      placeCaretAtEnd(editableEstimation);
    }
  }
</script>

<div class="flex justify-center items-center space-x-2 mt-auto ml-auto">
    <div class="flex flex-row items-center space-x-2">   
        <div class="stats shadow rounded-lg mb-2">
            <div class="stat relative">
                <div class="stat-title">Total Estimate</div>
                <div bind:this={editableEstimation} class="stat-value text-center" contenteditable={$isModerator && !saveIsDisabled} oninput={onTotalEdit}>{$totalEstimation}</div>
                {#if $isModerator && !saveIsDisabled}
                  <button class="absolute right-2 bottom-2" onclick={focusEditableEstimation}>
                    <Pencil class="h-4 w-4 text-gray-500 cursor-pointer hover:text-violet-600" />
                  </button>
                {/if}
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
          <button onclick={resetEstimation} class="px-4 py-1 bg-[var(--color-bg)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text)] rounded-md transition w-full">Reestimate</button>
        </div>
        {/if}
    </div> 
</div>