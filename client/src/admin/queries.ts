import { createMutation, createQuery } from "@tanstack/svelte-query";

import { createRoom, updateRoom } from "../services/roomService";
import queryClient from "./queryClient";
import ToastService from "../services/toastService";
import type { Room } from "../lib/types";
import { fetchIntegrationConfig } from "../services/integrationService";
import { formData } from "./state.svelte";

export const createAddRoomMutation = () =>
  createMutation({
    mutationKey: ["createRoom"],
    mutationFn: () => createRoom(formData),
    onSuccess: async (newRoom) => {
      queryClient.cancelQueries({ queryKey: ["rooms"] });

      const prevRooms = queryClient.getQueryData(["rooms"]);

      queryClient.setQueryData(["rooms"], (old: []) => {
        const oldRooms = old || [];
        return [...oldRooms, newRoom];
      });

      ToastService.showToast("The room was created.", { type: "success" });

      return prevRooms;
    },

    onError: (_, newRoom, context: any) => {
      ToastService.showToast("Error creating the room.", { type: "error" });
      queryClient.setQueryData(["rooms"], context.prevRooms);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

export const createEditRoomMutation = () =>
  createMutation({
    mutationKey: ["editRoom"],
    mutationFn: (roomData: any) => updateRoom(roomData),
    onMutate: async () => {
      queryClient.cancelQueries({ queryKey: ["rooms"] });
    },

    onSuccess: (updatedRoom: Room) => {
      ToastService.showToast("The room was updated.", { type: "success" });

      queryClient.setQueryData(["rooms"], (old: Room[]) => {
        const oldRooms = [...old];
        const index = oldRooms.findIndex((r) => r.id === updatedRoom.id);
        if (index !== -1) {
          oldRooms[index] = updatedRoom;
        }
        return oldRooms;
      });
    },

    onError: () => {
      ToastService.showToast("Error updating the room.", { type: "error" });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

export const createIntegrationConfigQuery = () =>
  createQuery({
    queryKey: ["integrationConfig"],
    queryFn: () => fetchIntegrationConfig({ id: formData.integration?.id }),
    staleTime: Infinity,
    enabled: false,
  });
