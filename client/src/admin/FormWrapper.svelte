<script lang="ts">
    import { modalStore } from "../store";
    import { FORM_BUTTONS, formService, INTEGRATION_NAMES } from "./constants";
    import { CreateRoomSchema} from "./validators";
    import { formData } from "./state.svelte";
  import TestConnectionButton from "./TestConnectionButton.svelte";

    const props = $props();

    const CurrentForm = $derived(formService.getCurrentPage());

    let formErrors = $state({});
  
    let formRef: HTMLFormElement | null = $state(null);

    const isIntegrationAdded = $derived(formData.integration?.id === INTEGRATION_NAMES.JIRA);
  
    const triggerFormSubmit = () => {
      if (formRef) {
        formRef.requestSubmit(); // Triggers the form's submit event
      }
    };

    const onIntegrationInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (formData.integration && !target.value) {
        delete formData.integration;
      }

      if (target.value) {
        formData.integration = {
          id: target.value as INTEGRATION_NAMES
        }
      }
    };
  
    async function onSubmit(event: Event) {
      event.preventDefault();
      const parsed = CreateRoomSchema.safeParse(formData);

      if (!parsed.success) {
        formErrors = parsed.error.format();
        console.log('formErrors', formErrors);
        return;
      }
      props.onSubmit(formData);
    };
  
    function onAction() {
      closeModal();
      triggerFormSubmit();
    }

    function closeModal() {
      modalStore.update((store) => ({...store, isOpen: false, Content: null, key: Date.now()}));
    }

    function onBack() {
      formService.prevPage();
    }

    function onNext() {
      formService.nextPage();
    }

    function leftButtonClick() {
      if (formService.isFirstPage()) {
        closeModal();
    } else {
        onBack();
      }
    }

    function rightButtonClick() {
      if (formService.isFirstPage() && isIntegrationAdded) {
          onNext();
        } else {
          onAction(); 
      }
    }

    const leftButtonLabel = $derived.by(() => {
        if (!formService.isFirstPage() && isIntegrationAdded) {
            return FORM_BUTTONS.BACK;
        }
        return FORM_BUTTONS.CANCEL;
    })

    const rightButtonLabel = $derived.by(() => {
        if (formService.isFirstPage() && isIntegrationAdded) {
            return FORM_BUTTONS.NEXT;
        }
        if (props.buttonLabels?.create) {
            return props.buttonLabels.create;
        }
        return FORM_BUTTONS.CREATE
    });
</script>

<CurrentForm bind:formRef values={formData} onSubmit={onSubmit} errors={formErrors} onIntegrationInput={onIntegrationInput} />
<div class="modal-action">
    <div class="flex justify-between w-full">
        <button class="btn btn-secondary min-h-10 h-10" onclick={leftButtonClick}>{leftButtonLabel}</button>
        {#if !formService.isFirstPage() && formData.integration?.filterLabel}
          <TestConnectionButton />
        {/if}
        <button class="btn btn-primary min-h-10 h-10" onclick={rightButtonClick}>{rightButtonLabel}</button>
    </div>
</div>
