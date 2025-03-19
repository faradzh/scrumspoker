<script lang="ts">
  import Input from "./Input.svelte";
  let {formRef = $bindable(), values, onSubmit} = $props();
</script>

<form onsubmit={onSubmit} bind:this={formRef} class="form-control text-black w-full">
    <h2 class="font-semibold tracking-tight text-xl text-violet-700 dark:text-violet-300 mb-4">Create Estimation Room</h2>
    <div class="mb-4">
        <Input id="jiraEmail" label="Jira Email" placeholder="Enter your Jira email" bind:value={values.jiraEmail} />
    </div>
    <div class="mb-4">
        <Input id="apiToken" label="API Token" placeholder="Enter your Jira API token" bind:value={values.apiToken} />
    </div>
    <div class="mb-4">
        <Input id="filterLabel" label="Filter Label" placeholder="Enter filter label for Jira issues" bind:value={values.filterLabel} />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">This label will be used to filter issues for the session.</p>
    </div>
    <div class="mb-4">
        <Input id="projectName" label="Project Name" placeholder="Enter Jira project name" bind:value={values.projectName} />
    </div>
</form>