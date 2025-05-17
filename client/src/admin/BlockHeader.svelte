<script lang="ts">
  import { Plus } from "@lucide/svelte";
  import { modalStore, rooms } from "../store";
  import FormWrapper from "./FormWrapper.svelte";
  import { formData, INITIAL_FORM_DATA } from "./state.svelte";
  import { formService } from "./constants";
  import { CreateRoomSchema } from "./validators";
  import { createRoom } from "../services/roomService";

  function resetFormData() {
    formData.name = INITIAL_FORM_DATA.name;
    formData.estimationMethod = INITIAL_FORM_DATA.estimationMethod;
    formData.integration = INITIAL_FORM_DATA.integration;
  }

  async function onSubmit(formData: FormData) {
    const newRoom = await createRoom(formData);
    rooms.update((prevRooms) => [...prevRooms, newRoom]);
  };

  function openModal() {
    formService.setCurrentPageIdx(0);
    resetFormData();
    modalStore.set({isOpen: true, Content: FormWrapper, props: {onSubmit} });
  }
</script>

<div class="pb-6">
  <div class="flex justify-between items-center">
    <div class="sm:text-center lg:text-left">
      <h1 class="text-2xl font-semibold text-[var(--color-text)]">
        Estimation Rooms
      </h1>
    </div>

    <button class="btn btn-primary" onclick={openModal}>
      <Plus size="20" />
      <span>Create Room</span>
    </button>
  </div>
</div>
