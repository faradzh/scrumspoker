<script lang="ts">
  import { currentUser } from "../store";
import Input from "./Input.svelte";
  import SecretField from "./SecretField.svelte";
  
  let {formRef = $bindable(), values, errors, onSubmit} = $props();
</script>

<form onsubmit={onSubmit} bind:this={formRef} class="form-control text-black w-full">
    <h2 class="font-semibold tracking-tight text-xl text-[var(--color-text)] mb-4">Create Estimation Room</h2>
    <!-- {#if $currentUser.accessTokenType === 'google'}
        <div class="mb-4">
            <Input id="email" type="email" label="Jira Email *" placeholder="Enter your Jira email" bind:value={values.integration.email} error={errors.integration?.email} />
        </div>
        <div class="mb-4 space-y-2">
            <SecretField id="apiToken" type="password" label="API Token *" placeholder="Enter your Jira API token" bind:value={values.integration.apiToken} error={errors.integration?.apiToken} />
        </div>
    {/if} -->
    <div class="mb-4">
        <Input id="filterLabel" label="Filter Label *" placeholder="Enter filter label for Jira issues" bind:value={values.integration.filterLabel} error={errors.integration?.filterLabel} />
        <p class="text-xs text-gray-500 mt-2">This label will be used to filter issues for the session.</p>
    </div>
    <div class="mb-4">
        <Input id="projectName" label="Project Name" placeholder="Enter Jira project name" bind:value={values.integration.projectName} error={errors.integration?.projectName} />
    </div>
</form>