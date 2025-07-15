<script lang="ts">
  import { Plus } from "@lucide/svelte";
  import { useQueryClient } from "@tanstack/svelte-query";

  import { modalStore } from "../store";
  import FormWrapper from "./FormWrapper.svelte";
  import { addResourceId, connectionState, resetFormData } from "./state.svelte";
  import { formService } from "./constants";
  import { createAddRoomMutation } from "./queries";

  const queryClient = useQueryClient();
  const createRoomMutation = createAddRoomMutation();

  function onSubmit() {
    addResourceId();
    $createRoomMutation.mutate();
  }

  function openCreateRoomDialog() {
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

    <button class="btn btn-primary" onclick={openCreateRoomDialog}>
      <Plus size="20" />
      <span>Create Room</span>
    </button>
  </div>
</div>
