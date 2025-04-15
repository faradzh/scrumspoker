<script lang="ts">
  import { extractErrorMessage } from "./validators";

    let {id, label, value = $bindable(), type = 'text', placeholder, error, ...rest} = $props();

    const errorClassName = $derived(error ? 'input-error' : '');
    const errorMessage = $derived(extractErrorMessage(error));
</script>

<label for={id} class="label text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 pl-0">{label}</label>
<input id={id} type={type} placeholder={placeholder} class={`input input-bordered ${errorClassName} w-full h-9 rounded-md placeholder:text-[14px]`} bind:value={value} {...rest} />
{#if error}
    <p class="text-xs text-red-500 mt-2">{errorMessage}</p>
{/if}