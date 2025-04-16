<script lang="ts">
    import { modalStore, rooms } from "../store";
    import IntegrationForm from "./IntegrationForm.svelte";
    import FormService from "./FormService.svelte";
    import RoomForm from "./RoomForm.svelte";
    import { FORM_BUTTONS, INTEGRATION_NAMES } from "./constants";
    import { CreateRoomSchema} from "./validators";
    import { formData } from "./state.svelte";
    
    const formService = new FormService([RoomForm, IntegrationForm]);
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

      const response = await fetch('/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      const room = await response.json();
      rooms.update((prevRooms) => [...prevRooms, room]);
    };
  
    function onAction() {
      closeModal();
      triggerFormSubmit();
    }

    function closeModal() {
      modalStore.update((store) => ({...store, isOpen: false}));
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
        return FORM_BUTTONS.CREATE
    })
</script>

<CurrentForm bind:formRef values={formData} onSubmit={onSubmit} errors={formErrors} onIntegrationInput={onIntegrationInput} />
<div class="modal-action">
    <div class="flex justify-between w-full">
        <button class="btn btn-secondary min-h-10 h-10" onclick={leftButtonClick}>{leftButtonLabel}</button>
        <button class="btn btn-primary min-h-10 h-10" onclick={rightButtonClick}>{rightButtonLabel}</button>
    </div>
</div>
