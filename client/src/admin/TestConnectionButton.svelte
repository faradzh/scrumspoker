<script lang="ts">
    import { createQuery } from '@tanstack/svelte-query';
    // import { extractErrorMessage } from "./validators";
    import { testIntegration } from '../services/integrationService';
    import { formData } from './state.svelte';
     import { Cable, Check, CircleX } from '@lucide/svelte';

    // let {id, label, value = $bindable(), type = 'text', placeholder, error, ...rest} = $props();

    // const errorClassName = $derived(error ? 'input-error' : '');
    // const errorMessage = $derived(extractErrorMessage(error));

    const query = createQuery({
        queryKey: ['connectionTest'],
        queryFn: () => testIntegration({id: formData.integration?.id, filterLabel: formData.integration?.filterLabel, projectName: formData.integration?.projectName}),
        enabled: false,
        retry: 1,
        staleTime: Infinity
    });

    const testConnection = (e: MouseEvent) => {
        e.preventDefault();
        $query.refetch();
    };
</script>

<!-- <label for={id} class="label text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 pl-0">{label}</label> -->
<!-- <div class="flex space-x-1"> -->
    <button onclick={testConnection} type="button" class="btn btn-secondary min-h-10 h-10">
        {#if $query.isFetching}
            <span class="loading loading-spinner h-4 w-4"></span>
        {:else if $query.error}
            <span class="text-[var(--color-error)]">
                <CircleX class="h-4 w-4" />
            </span>
        {:else if $query.isSuccess}
            <span class="text-[var(--color-success)]">
                <Check class="h-4 w-4" />
            </span>
        {:else}
            <Cable class="h-4 w-4" />
        {/if}
        <span>
            Test
        </span>
    </button>
<!-- </div> -->
<!-- {#if error}
    <p class="text-xs text-red-500 mt-2">{errorMessage}</p>
{/if} -->