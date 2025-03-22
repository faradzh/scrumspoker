<script lang="ts">
    let {value, error} = $props();
    const errorClassName = $derived(error ? 'select-error' : '');

    $effect(() => {
        console.log('value', value);
    });
</script>

<div class="label text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 pl-0">Estimation Method</div>
<select class={`select select-bordered ${errorClassName} w-full h-9 min-h-9 rounded-md`} bind:value={value}>
    <option disabled>Choose the method</option>
    <option value="fibbonachi">Fibbonachi sequence</option>
    <option value="powerOfTwo">Powers of 2</option>
    <option value="tshirtSizes">T-shirt sizes</option>
</select> 