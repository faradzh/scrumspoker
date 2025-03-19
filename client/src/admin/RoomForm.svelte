<script lang="ts">
    let {formRef = $bindable(), values, onSubmit, onIntegrationChange} = $props();
</script>

<form onsubmit={onSubmit} bind:this={formRef} class="form-control text-black w-full">
    <h2 class="font-semibold tracking-tight text-xl text-violet-700 dark:text-violet-300 mb-4">Create Estimation Room</h2>
    <div class="mb-4">
        <label for="name" class="label text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 pl-0">Room Name</label>
        <input id="name" type="text" placeholder="Enter room name" class="input input-bordered w-full h-9 rounded-md" bind:value={values.name} />
    </div>
    <div class="mb-4">
        <div class="label text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 pl-0">Maximum Participants</div>
        <input type="number" class="input input-bordered w-full h-9 rounded-md" value="5" min="1" />
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
        <input type="radio" name="" aria-label="None" class="btn btn-outline h-9 min-h-9 text-white radio-btn" checked={values.integrationId === '' || values.integrationId === undefined} onchange={onIntegrationChange} />
        <input type="radio" name="Jira" aria-label="Jira" class="btn btn-outline h-9 min-h-9  text-white radio-btn" checked={values.integrationId === 'Jira'} onchange={onIntegrationChange} />
        <input type="radio" name="Asana" aria-label="Asana" class="btn btn-outline h-9 min-h-9 text-white radio-btn" checked={values.integrationId === 'Asana'} onchange={onIntegrationChange} />
    </div>
</form>