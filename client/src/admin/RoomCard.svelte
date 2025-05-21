<script lang="ts">
  import { Check, Copy, Link, Settings, Trash } from "@lucide/svelte";
  import { formErrors, modalStore } from "../store";
  import { formData } from "./state.svelte";
  import FormWrapper from "./FormWrapper.svelte";
  import { formService } from "./constants";
  import DeleteRoomDialog from "./DeleteRoomDialog.svelte";
  import { updateRoom } from "../services/roomService";
  import ToastService from "../services/toastService";
  import { createMutation, useMutationState, useQueryClient } from "@tanstack/svelte-query";
  import type { Room } from "../lib/types";
  import RoomCardSkeleton from "./RoomCardSkeleton.svelte";

    let { room } = $props();
    let copiedToClipboard = $state(false);

    const origin = window.location.origin;
    const roomLink = `${origin}/join/${room.id}`;
    
    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text)
            .then(() => {
                copiedToClipboard = true;
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }

    function prepopulateFormData() {
        formData.name = room.name;
        formData.integration = {
            id: room.integration.id,
            filterLabel: room.integration.filterLabel,
            projectName: room.integration.projectName
        }
    }

    const queryClient = useQueryClient();

    const query = createMutation({
        mutationKey: ['editRoom'],
        mutationFn: (roomData: any) => updateRoom(roomData),
        onMutate: async () => {
            queryClient.cancelQueries({ queryKey: ['rooms'] });
        },

        onSuccess: (updatedRoom: Room) => {
            ToastService.showToast("The room was updated.", {type: "success"});

            queryClient.setQueryData(['rooms'], (old: Room[]) => {
                const oldRooms = [...old];
                const index = oldRooms.findIndex(r => r.id === updatedRoom.id);
                if (index !== -1) {
                    oldRooms[index] = updatedRoom;
                }
                return oldRooms;
            });
        },

        onError: () => {
            ToastService.showToast("Error updating the room.", {type: "error"});
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        },
    });

    const mutationState = useMutationState<any>({filters: {mutationKey: ['editRoom']}});

    const isMutationPending = $derived($mutationState[0]?.status === 'pending' && $mutationState[0]?.variables?.id === room.id);

    async function onSubmit(formData: FormData) {
        $query.mutate({id: room.id, ...formData});
    };

    function openEditDialog() {
        formErrors.set({});
        queryClient.removeQueries({ queryKey: ['connectionTest'] });
        formService.setCurrentPageIdx(0);
        prepopulateFormData();
        modalStore.set({ isOpen: true, Content: FormWrapper, props: {buttonLabels: {create: 'Update'}, onSubmit}, key: Date.now() });
    }

    function openDeleteDialog() {
        modalStore.set({ isOpen: true, Content: DeleteRoomDialog, props: {roomId: room.id}, key: Date.now() });
    }
</script>

{#if isMutationPending}
    <RoomCardSkeleton />
{:else}
    <div class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-4 border-l-4 border-violet-500 hover:bg-violet-50">
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-medium text-lg text-black">{room.name}</h3>
                <div class="flex space-x-1">
                <button class="p-1 text-gray-500 hover:text-violet-600">
                    <Settings size="16" onclick={openEditDialog}/>
                </button>
                <button class="p-1 text-gray-500 hover:text-red-600">
                    <Trash size="16" onclick={openDeleteDialog}/>
                </button>
                </div> 
            </div>
            <div class="flex items-center space-x-2 mb-3">
                <div class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-[var(--color-primary)]">
                    {room.estimationMethod}
                </div>
                <!-- <div class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-[var(--color-secondary)]">
                8 participants
                </div> -->
            </div> 
            <div class="text-xs text-gray-500 flex items-center mb-1">
                <span class="inline-block w-2 h-2 rounded-full bg-[var(--color-success)] mr-2">
                </span>
                Jira Integration: connected
            </div>
            <div class="text-xs text-gray-500 flex items-center">
                <span class="mr-2 text-black">
                    <Link size="10" />
                </span>
                <span class="text-xs w-[85%] text-ellipsis overflow-hidden whitespace-nowrap text-[var(--color-text)]">
                    <a href={roomLink} class="underline">{roomLink}</a>
                </span>
                <button class="p-1 text-gray-500 hover:text-violet-600 ml-auto">
                    {#if copiedToClipboard}
                        <span class="text-[var(--color-success)]">
                            <Check size="16" />
                        </span>
                    {:else}
                        <Copy size="16" onclick={() => copyToClipboard(roomLink)} />
                    {/if}
                </button>
            </div>
        </div>
    </div>
{/if}