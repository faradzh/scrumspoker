<script lang="ts">
    import { createQuery } from '@tanstack/svelte-query';
    import { Cable, CircleX } from '@lucide/svelte';
    import { testIntegration } from '../services/integrationService';
    import { formData, formStateSinceLastTest } from './state.svelte';
    import { FORM_BUTTONS, formService, INTEGRATION_NAMES } from './constants';
    import { modalStore, formErrors } from '../store';

    const {formRef, label} = $props();

    const isIntegrationAdded = $derived(formData.integration?.id === INTEGRATION_NAMES.JIRA);

    const query = createQuery({
        queryKey: ['connectionTest'],
        queryFn: () => testIntegration({
            id: formData.integration?.id,
            filterLabel: formData.integration?.filterLabel,
            projectName: formData.integration?.projectName
        }).then((response) => {
            formStateSinceLastTest.modified = false;
            return response;
        }),
        enabled: false,
        retry: 1,
        staleTime: Infinity
    });
    
    function closeModal() {
      modalStore.update((store) => ({...store, isOpen: false, Content: null, key: Date.now()}));
    }

    const triggerFormSubmit = () => {
      if (formRef) {
        formRef.requestSubmit(); // Triggers the form's submit event
      }
    };

    function onAction() {
      triggerFormSubmit();
      console.log('Errors', formErrors);
      if (Object.keys($formErrors).length) {
        return;
      }
      closeModal();
    }

    const testConnection = (e: MouseEvent) => {
      e.preventDefault();
      formErrors.set({}); // Clear previous errors
      $query.refetch();
    };

    function onClick() {
      if (formService.isFirstPage() && isIntegrationAdded) {
        formService.nextPage();
      } else {
        onAction(); 
      }
    }

    const buttonLabel = $derived.by(() => {
        if (formService.isFirstPage() && isIntegrationAdded) {
            return FORM_BUTTONS.NEXT;
        }

        if (label) {
            return label;
        }
        
        return FORM_BUTTONS.CREATE;
    });

    const shouldShowTestButton = $derived.by(() => {
        if (formService.isFirstPage()) {
            return false;
        } else if ((!$query.isSuccess || formStateSinceLastTest.modified) && formData.integration?.filterLabel) {
            return true;
        }
        return false;
    });
</script>

{#if shouldShowTestButton}
    <button onclick={testConnection} type="button" class="btn btn-primary min-h-10 h-10">
        {#if $query.isFetching}
            <span class="loading loading-spinner h-4 w-4"></span>
        {:else if $query.error}
            <span class="text-[var(--color-error)]">
                <CircleX class="h-4 w-4" />
            </span>
        {:else}
            <Cable class="h-4 w-4" />
        {/if}
        <span>
            Test
        </span>
    </button>
{:else}
    <button class="btn btn-primary min-h-10 h-10" onclick={onClick}>{buttonLabel}</button>
{/if}