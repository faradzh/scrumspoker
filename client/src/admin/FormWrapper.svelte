<script lang="ts">
    import { modalStore, formErrors } from "../store";
    import { FORM_BUTTONS, formService, INTEGRATION_NAMES } from "./constants";
    import { CreateRoomSchema} from "./validators";
    import { formData } from "./state.svelte";
    import TestConnectionButton from "./TestConnectionButton.svelte";

    const props = $props();

    const CurrentForm = $derived(formService.getCurrentPage());

    const isIntegrationAdded = $derived(formData.integration?.id === INTEGRATION_NAMES.JIRA);

    let formRef: HTMLFormElement | null = $state(null);

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
        formErrors.set(parsed.error.format());
        return;
      }
      props?.onSubmit(formData);
    };

    function closeModal() {
      modalStore.update((store) => ({...store, isOpen: false, Content: null, key: Date.now()}));
    }

    function onBack() {
      formService.prevPage();
    }

    function leftButtonClick() {
      if (formService.isFirstPage()) {
        closeModal();
    } else {
        onBack();
      }
    }

    const leftButtonLabel = $derived.by(() => {
        if (!formService.isFirstPage() && isIntegrationAdded) {
            return FORM_BUTTONS.BACK;
        }
        return FORM_BUTTONS.CANCEL;
    })
</script>

<CurrentForm bind:formRef values={formData} onSubmit={onSubmit} errors={$formErrors} onIntegrationInput={onIntegrationInput} />
<div class="modal-action">
    <div class="flex justify-between w-full">
        <button class="btn btn-secondary min-h-10 h-10" onclick={leftButtonClick}>{leftButtonLabel}</button>
        <TestConnectionButton formRef={formRef} label={props.buttonLabels?.create} />
    </div>
</div>
