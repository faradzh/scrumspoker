<script lang="ts">
    let {id, label, value = $bindable(), type = 'text', placeholder, ...rest} = $props();
</script>

<label for={id} class="label text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 pl-0">{label}</label>
<input id={id} type={type} placeholder={placeholder} class="input input-bordered w-full h-9 rounded-md" bind:value={value} {...rest} />