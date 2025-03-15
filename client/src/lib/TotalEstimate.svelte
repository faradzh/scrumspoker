<script lang="ts">
  import { updateIssue } from "../services/roomService";
  import { storiesState } from "../state.svelte";
  import { totalEstimate } from "../store";

  function saveHandler() {
    const issueId = storiesState.selectedStory?.id!;
    updateIssue(issueId, $totalEstimate);
  }
</script>

<div class="flex justify-start space-x-2">
    <div class="flex flex-col">   
        <div class="stats shadow rounded-lg">
            <div class="stat">
                <div class="stat-title">Total Estimate</div>
                <div class="stat-value">{$totalEstimate}</div>
                <!-- <div class="stat-desc">as average</div> -->
            </div>
        </div>
    </div>  
    <button onclick={saveHandler} class="btn self-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition">Save</button>
</div>