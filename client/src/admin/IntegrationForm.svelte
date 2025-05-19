<script lang="ts">
  import { onMount } from "svelte";
  import { BadgeX, LucideEclipse, SearchCheck } from "@lucide/svelte";

  import { queryClient } from "./constants";
  import Input from "./Input.svelte";
  
  let {formRef = $bindable(), values, errors, onSubmit} = $props();

  let connectionState = $state<any>({});

  onMount(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(event => {
        if (event.query.queryKey[0] === 'connectionTest') {
            connectionState = event.query.state;
        }
    });
    
    return unsubscribe;
  });
</script>

<form onsubmit={onSubmit} bind:this={formRef} class="form-control text-black w-full">
    <h2 class="font-semibold tracking-tight text-xl text-[var(--color-text)] mb-4">Create Estimation Room</h2>
    <div class="mb-4">
        <Input id="filterLabel" label="Filter Label *" placeholder="Enter filter label for Jira issues" bind:value={values.integration.filterLabel} error={errors.integration?.filterLabel} />
        <p class="text-xs text-gray-500 mt-2">This label will be used to filter issues for the session.</p>
    </div>
    <div class="mb-4">
        <Input id="projectName" label="Project Name" placeholder="Enter Jira project name" bind:value={values.integration.projectName} error={errors.integration?.projectName} />
    </div>
    {#if connectionState.status === 'success' && connectionState.data.issues.total > 0}
        <div class="badge badge-success text-white py-3 rounded-md">
            {connectionState.data.issues.total} matching issues
        </div>
    {:else if connectionState.status === 'success' && connectionState.data.issues.total === 0}
        <div class="badge badge-error text-white py-3 rounded-md">
            {connectionState.data.issues.total} matching issues
        </div>
    {/if}

</form>