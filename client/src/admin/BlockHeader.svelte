<script lang="ts">
  import { Plus } from "@lucide/svelte";
  import { modalStore } from "../store";
  import FormWrapper from "./FormWrapper.svelte";
  import { connectionState, formData, INITIAL_FORM_DATA } from "./state.svelte";
  import { formService } from "./constants";
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { createRoom } from "../services/roomService";
  import ToastService from "../services/toastService";

  const queryClient = useQueryClient();

  export const createRoomMutation = createMutation({
    mutationKey: ['createRoom'],
    mutationFn: () => createRoom(formData),
    onSuccess: async (newRoom) => {
      queryClient.cancelQueries({ queryKey: ['rooms'] });

      const prevRooms = queryClient.getQueryData(['rooms']);

      queryClient.setQueryData(['rooms'], (old: []) => {
        const oldRooms = old || [];
        return [...oldRooms, newRoom];
      });

      ToastService.showToast("The room was created.", {type: "success"});

      return prevRooms;
    },

    onError: (_, newRoom, context: any) => {
      ToastService.showToast("Error creating the room.", {type: "error"});
      queryClient.setQueryData(['rooms'], context.prevRooms);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  function resetFormData() {
    formData.name = INITIAL_FORM_DATA.name;
    formData.estimationMethod = INITIAL_FORM_DATA.estimationMethod;
    formData.integration = INITIAL_FORM_DATA.integration;
  }

  async function onSubmit() {
    $createRoomMutation.mutate();
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
