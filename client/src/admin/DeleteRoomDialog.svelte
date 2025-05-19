<script lang="ts">
  import { CircleX } from "@lucide/svelte";
  import { modalStore, rooms } from "../store";
  import { deleteRoom, fetchRooms } from "../services/roomService";
  import ToastService from "../services/toastService";

  const { roomId } = $props();

  function leftButtonClick() {
    modalStore.update((store) => ({ ...store, isOpen: false, Content: null }));
  }

  async function rightButtonClick() {
    rooms.update((rooms) => rooms.filter((room) => room.id !== roomId));
    modalStore.update((store) => ({ ...store, isOpen: false, Content: null, key: Date.now() }));

    await deleteRoom(roomId)
        .then(() => {
            // Handle successful deletion
            ToastService.showToast("The room was deleted.", {type: "success"});
        })
        .catch(async (error) => {
            const data = await fetchRooms();
            rooms.set(data);
            // Handle error
            console.error("Error deleting room:", error);
        });
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