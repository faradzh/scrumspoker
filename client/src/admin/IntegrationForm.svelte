<script lang="ts">
  import { onMount } from "svelte";

  import Input from "./Input.svelte";
  import { connectionState, formSelectData, formStateSinceLastTest } from "./state.svelte";
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
    {#if formSelectData.resources.length > 1}
      <div class="mb-4">
        <label for="resource" class="label text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 pl-0">Domain *</label>
        <select class="select min-h-9 h-9 select-bordered w-full rounded-md" bind:value={values.integration.resourceUrl} id="resource" required>
          {#each formSelectData.resources as resource}
            <option value={resource.url}>{resource.url}</option>
          {/each}
        </select>
      </div>
    {/if}
    {#if formSelectData.fields.length > 1}
      <div class="mb-4">
        <label for="resource" class="label text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 pl-0">Story Points Field Name *</label>
        <select class="select min-h-9 h-9 select-bordered w-full rounded-md" bind:value={values.integration.fieldId} id="resource" required>
          {#each formSelectData.fields as field}
            <option value={field.id}>{field.name}</option>
          {/each}
        </select>
      </div>
    {/if}
    {#if issuesTotal >= 0 }
        <div class={`badge ${issuesTotal > 0 ? 'badge-success' : 'badge-error'} text-white py-3 rounded-md`}>
            {issuesTotal} matching issues
        </div>
    {/if}
</form>