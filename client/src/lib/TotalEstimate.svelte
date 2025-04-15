<script lang="ts">
  import { updateIssue } from "../services/roomService";
  import { currentIssueId, isModerator, totalEstimate } from "../store";

  function saveHandler() {
    $currentIssueId && updateIssue($currentIssueId, $totalEstimate);
  }
</script>

<div class="flex justify-center items-center space-x-2">
    <div class="flex flex-col">   
        <div class="stats shadow rounded-lg mb-2">
            <div class="stat">
                <div class="stat-title">Total Estimate</div>
                <div class="stat-value text-center">{$totalEstimate}</div>
            </div>
        </div>
        {#if $isModerator} 
          <button onclick={saveHandler} class="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition w-full">Save</button>
        {/if}
    </div> 
   
</div>