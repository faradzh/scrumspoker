<script lang="ts">
  import { INTEGRATION_NAMES } from "./constants";
    import Input from "./Input.svelte";
    let {formRef = $bindable(), values, onSubmit, onIntegrationChange} = $props();
</script>

<form onsubmit={onSubmit} bind:this={formRef} class="form-control text-black w-full">
    <h2 class="font-semibold tracking-tight text-xl text-violet-700 dark:text-violet-300 mb-4">Create Estimation Room</h2>
    <div class="mb-4">
        <Input id="name" label="Room Name" placeholder="Enter room name" bind:value={values.name} />
    </div>
    <div class="mb-4">
        <Input id="maxParticipants" label="Maximum Participants" type="number" value="5" min="1" />
    </div>
    <div class="mb-4">
        <div class="label text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 pl-0">Estimation Method</div>
        <select class="select select-bordered w-full h-9 min-h-9 rounded-md" bind:value={values.estimationMethod}>
            <option disabled>Choose the method</option>
            <option value="fibbonachi">Fibbonachi sequence</option>
            <option value="powerOfTwo">Powers of 2</option>
            <option value="tshirtSizes">T-shirt sizes</option>
        </select> 
    </div>
    <div class="mb-4">
        <div class="label text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 pl-0">Integration</div>
        <input
            type="radio"
            name=""
            aria-label="None"
            class="btn btn-outline h-9 min-h-9 text-white radio-btn"
            checked={values.integrationId === '' || values.integrationId === undefined} 
            onchange={onIntegrationChange} 
        />
        <input
            type="radio"
            name={INTEGRATION_NAMES.JIRA}
            aria-label="Jira"
            class="btn btn-outline h-9 min-h-9 text-white radio-btn"
            checked={values.integrationId === INTEGRATION_NAMES.JIRA}
            onchange={onIntegrationChange} 
        />
        <input
            type="radio"
            name={INTEGRATION_NAMES.ASANA}
            aria-label="Asana"
            class="btn btn-outline h-9 min-h-9 text-white radio-btn"
            checked={values.integrationId === INTEGRATION_NAMES.ASANA}
            onchange={onIntegrationChange} 
        />
    </div>
</form>