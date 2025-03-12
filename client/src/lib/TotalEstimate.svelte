<script lang="ts">
  import { totalEstimate } from "../store";
</script>

<div class="flex justify-center space-x-2">
    <div class="flex flex-col">   
        <div class="stats shadow-md rounded-lg">
            <div class="stat">
                <div class="stat-title">Total Estimate</div>
                <div class="stat-value">{$totalEstimate}</div>
                <div class="stat-desc">as average</div>
            </div>
        </div>
    </div>  
    <button class="btn self-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition">Save</button>
</div>