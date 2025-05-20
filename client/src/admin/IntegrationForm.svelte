<script lang="ts">
  import { onMount } from "svelte";

  import Input from "./Input.svelte";
  import { connectionState, formStateSinceLastTest } from "./state.svelte";
  import queryClient from "./queryClient";
  
  let {formRef = $bindable(), values, errors, onSubmit} = $props();

  onMount(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(event => {
        if (event.query.queryKey[0] === 'connectionTest') {
            Object.assign(connectionState, event.query.state);
        }
    });
    
    return unsubscribe;
  });

  const issuesTotal = $derived.by(() => {
    if (connectionState.status === 'success') {
        return connectionState.data.issues.total;
    }
  });

  function onTestConnection() {
    formStateSinceLastTest.modified = true;
  }
</script>

<form onsubmit={onSubmit} oninput={onTestConnection} bind:this={formRef} class="form-control text-black w-full">
    <h2 class="font-semibold tracking-tight text-xl text-[var(--color-text)] mb-4">Create Estimation Room</h2>
    <div class="mb-4">
        <Input id="filterLabel" label="Filter Label *" placeholder="Enter filter label for Jira issues" bind:value={values.integration.filterLabel} error={errors.integration?.filterLabel} />
        <p class="text-xs text-gray-500 mt-2">This label will be used to filter issues for the session.</p>
    </div>
    <div class="mb-4">
        <Input id="projectName" label="Project Name" placeholder="Enter Jira project name" bind:value={values.integration.projectName} error={errors.integration?.projectName} />
    </div>
    {#if issuesTotal >= 0 }
        <div class={`badge ${issuesTotal > 0 ? 'badge-success' : 'badge-error'} text-white py-3 rounded-md`}>
            {issuesTotal} matching issues
        </div>
    {/if}
</form>