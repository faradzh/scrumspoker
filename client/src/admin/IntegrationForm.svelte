<script lang="ts">
    let {formRef = $bindable(), values, onSubmit} = $props();
</script>

<form onsubmit={onSubmit} bind:this={formRef} class="form-control text-black w-full">
    <h2 class="font-semibold tracking-tight text-xl text-violet-700 dark:text-violet-300 mb-4">Create Estimation Room</h2>
    <div class="mb-4">
        <label for="jiraEmail" class="label text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 pl-0">Jira Email</label>
        <input id="jiraEmail" type="text" placeholder="Enter your Jira email" class="input input-bordered w-full h-9 rounded-md" bind:value={values.jiraEmail} />
    </div>
    <div class="mb-4">
        <label for="apiToken" class="label text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 pl-0">API Token</label>
        <input id="apiToken" type="text" placeholder="Enter your Jira API token" class="input input-bordered w-full h-9 rounded-md" bind:value={values.apiToken} />
    </div>
    <div class="mb-4">
        <label for="filterLabel" class="label text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 pl-0">Filter Label</label>
        <input id="filterLabel" type="text" placeholder="Enter filter label for Jira issues" class="input input-bordered w-full h-9 rounded-md" bind:value={values.filterLabel} />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">This label will be used to filter issues for the session.</p>
    </div>
    <div class="mb-4">
        <label for="projectName" class="label text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 pl-0">Project Name</label>
        <input id="projectName" type="text" placeholder="Enter Jira project name" class="input input-bordered w-full h-9 rounded-md" bind:value={values.projectName} />
    </div>
</form>