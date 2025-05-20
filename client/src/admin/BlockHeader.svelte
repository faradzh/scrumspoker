<script lang="ts">
  import { Plus } from "@lucide/svelte";
  import { modalStore, rooms } from "../store";
  import FormWrapper from "./FormWrapper.svelte";
  import { connectionState, formData, INITIAL_FORM_DATA } from "./state.svelte";
  import { formService } from "./constants";
  import queryClient from "./queryClient";
  import { createQuery } from "@tanstack/svelte-query";
  import { createRoom } from "../services/roomService";

  export const createRoomQuery = createQuery({
    queryKey: ["createRoom"],
    queryFn: () => createRoom(formData),
    enabled: false,
    retry: 0,
    staleTime: Infinity,
  });

  function resetFormData() {
    formData.name = INITIAL_FORM_DATA.name;
    formData.estimationMethod = INITIAL_FORM_DATA.estimationMethod;
    formData.integration = INITIAL_FORM_DATA.integration;
  }

  async function onSubmit() {
    const {data} = await $createRoomQuery.refetch();
    rooms.update((prevRooms) => [...prevRooms, data]);
  };

  function openModal() {
    queryClient.removeQueries({ queryKey: ['connectionTest'] });
    Object.assign(connectionState, {status: 'idle'});
    formService.setCurrentPageIdx(0);
    resetFormData();
    modalStore.set({isOpen: true, Content: FormWrapper, props: {onSubmit}, key: Date.now() });
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
