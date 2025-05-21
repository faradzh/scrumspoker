<script lang="ts">
  import { CircleX } from "@lucide/svelte";
  import { modalStore } from "../store";
  import { deleteRoom } from "../services/roomService";
  import ToastService from "../services/toastService";
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import type { Room } from "../lib/types";

  const { roomId } = $props();

  function leftButtonClick() {
    modalStore.update((store) => ({ ...store, isOpen: false, Content: null }));
  }

  const queryClient = useQueryClient();

  const query = createMutation({
    mutationKey: ['deleteRoom'],
    mutationFn: () => deleteRoom(roomId),
    onMutate: async (id: string) => {
      queryClient.cancelQueries({ queryKey: ['rooms'] });

      const prevRooms = queryClient.getQueryData(['rooms']);

      queryClient.setQueryData(['rooms'], (old: Room[]) => {
        const oldRooms = old || [];
        return oldRooms.filter((room) => room.id !== id);
      });

      return prevRooms;
    },

    onSuccess: () => {
        ToastService.showToast("The room was deleted.", {type: "success"});
    },

    onError: (_, newRoom, context: any) => {
      queryClient.setQueryData(['rooms'], context.prevRooms);
      ToastService.showToast("Error deleting the room.", {type: "error"});
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  async function rightButtonClick() {
    modalStore.update((store) => ({ ...store, isOpen: false, Content: null, key: Date.now() }));
    $query.mutate(roomId);
  }
</script>

<div class="form-control text-black w-full">
    <h2 class="text-xl font-semibold text-gray-800 flex items-center">
        <span class="text-[var(--color-error)] mr-2">
            <CircleX />
        </span>
        Delete Room?
    </h2>
    <p class="mt-4 text-gray-600">
        Are you sure you want to delete this room? <br /> This action cannot be undone.
    </p>
</div>
<div class="modal-action">
    <div class="flex justify-between w-full">
        <button class="btn btn-secondary min-h-10 h-10" onclick={leftButtonClick}>Cancel</button>
        <button class="btn btn-primary min-h-10 h-10" onclick={rightButtonClick}>Delete</button>
    </div>
</div>