<script lang="ts">
    import { INTEGRATION_NAMES } from "./constants";
    import Input from "./Input.svelte";
    import Select from "./Select.svelte";
    let {formRef = $bindable(), values, errors, onSubmit, onIntegrationInput} = $props<{onIntegrationInput?: any}>();
</script>

<form onsubmit={onSubmit} bind:this={formRef} class="form-control text-black w-full">
    <h2 class="font-semibold tracking-tight text-xl text-violet-700 mb-4">Create Estimation Room</h2>
    <div class="mb-4">
        <Input id="name" label="Room Name" placeholder="Enter room name" bind:value={values.name} error={errors.name} />
    </div>
    <div class="mb-4">
        <Input id="maxParticipants" label="Maximum Participants" type="number" value="5" min="1" />
    </div>
    <div class="mb-4">
        <Select value={values.estimationMethod} error={errors.estimationMethod} />
    </div>
    <div class="mb-4">
        <div class="label text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 pl-0">Integration</div>
        <input
            type="radio"
            name=""
            aria-label="None"
            class="btn btn-outline h-9 min-h-9 text-white radio-btn"
            value=""
            checked={!values.integration?.id}
            onchange={onIntegrationInput}
        />
        <input
            type="radio"
            name={INTEGRATION_NAMES.JIRA}
            aria-label="Jira"
            class="btn btn-outline h-9 min-h-9 text-white radio-btn"
            value={INTEGRATION_NAMES.JIRA}
            checked={values.integration?.id === INTEGRATION_NAMES.JIRA}
            onchange={onIntegrationInput}
        />
        <input
            type="radio"
            name={INTEGRATION_NAMES.ASANA}
            aria-label="Asana"
            class="btn btn-outline h-9 min-h-9 text-white radio-btn"
            value={INTEGRATION_NAMES.ASANA}
            checked={values.integration?.id === INTEGRATION_NAMES.ASANA}
            onchange={onIntegrationInput}
        />
    </div>
</form>