<script lang="ts">
    import { modalStore, rooms } from "../store";
    import IntegrationForm from "./IntegrationForm.svelte";
    import FormService from "./FormService.svelte";
    import RoomForm from "./RoomForm.svelte";
    
    const formService = new FormService([RoomForm, IntegrationForm]);
    const CurrentForm = $derived(formService.getCurrentPage());

    const formData = $state<{name: string, estimationMethod: string, integrationId?: string}>({
      name: '',
      estimationMethod: ''
    });
  
    let formRef: HTMLFormElement | null = $state(null);
    const isIntegrationAdded = $derived(formData.integrationId === 'Jira');
  
    const triggerFormSubmit = () => {
      if (formRef) {
        formRef.requestSubmit(); // Triggers the form's submit event
      }
    };
  
    async function onSubmit(event: Event) {
      event?.preventDefault();
      console.log(JSON.stringify(formData));
  
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
  
    function onIntegrationChange(e: MouseEvent) {
      const target = e.target as HTMLInputElement;
      const value = target.getAttribute('name');
      formData.integrationId = value ?? '';
    }
  
  
    function onAction() {
      modalStore.update((store) => ({...store, isOpen: false}));
      triggerFormSubmit();
    }

    function onClose() {
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
        onClose();
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
            return 'Back';
        }
        return 'Cancel';
    })

    const rightButtonLabel = $derived.by(() => {
        if (formService.isFirstPage() && isIntegrationAdded) {
            return 'Next';
        }
        return 'Create Room'
    })
</script>

<CurrentForm bind:formRef values={formData} onSubmit={onSubmit} onIntegrationChange={onIntegrationChange} />
<div class="modal-action">
    <div class="flex justify-between w-full">
        <button class="btn bg-white text-black min-h-10 h-10" onclick={leftButtonClick}>{leftButtonLabel}</button>
        <button class="btn bg-violet-600 hover:bg-violet-700 text-white min-h-10 h-10" onclick={rightButtonClick}>{rightButtonLabel}</button>
    </div>
</div>
