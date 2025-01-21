<script lang="ts">
    let {formRef = $bindable(), values, onSubmit} = $props();
</script>

<form onsubmit={onSubmit} bind:this={formRef} class="form-control text-black max-w-sm m-auto">
    <div class="mb-4">
        <label for="name" class="label font-bold">Name</label>
        <input id="name" type="text" placeholder="Room name" class="input input-bordered w-full max-w-xs" bind:value={values.name} />
    </div>
    <div class="mb-4 max-w-xs">
        <div class="label font-bold">Participants</div>
        <input type="range" min="2" max="10" value="2" class="range range-xs" step="1" />
        <div class="flex w-full justify-between px-2 text-xs">
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
        </div>
    </div>
    <div class="mb-4">
        <div class="label font-bold">Estimation method</div>
        <select class="select select-bordered" bind:value={values.estimationMethod}>
            <option disabled>Choose the method</option>
            <option selected value="fibbonachi">Fibbonachi sequence</option>
            <option value="powerOfTwo">Powers of 2</option>
            <option value="tshirtSizes">T-shirt sizes</option>
        </select> 
    </div>
</form>